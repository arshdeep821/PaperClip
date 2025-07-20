import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Messages.module.css";
import SendIcon from "@mui/icons-material/Send";
import InMessageTradePanel from "../components/InMessageTradePanel";
import defaultProfileImage from "../assets/PaperclipDefault.png";

const socket = io("http://localhost:3001");
const BACKEND_URL = "http://localhost:3001";

function Messages() {
	const currentUser = useSelector((state) => state.user);
	const location = useLocation();
	const navigate = useNavigate();

	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Check if we're coming from an accepted offer
	useEffect(() => {
		if (
			(location.state?.fromAcceptedOffer && location.state?.otherUserId) ||
			(location.state?.fromUserSearch && location.state?.otherUserId)
		) {
			const otherUserId = location.state.otherUserId;
			const otherUsername = location.state.otherUsername;

			// Create or find conversation with this user
			startConversation(otherUserId, otherUsername);

			// Clear the state to prevent re-triggering
			navigate("/chats", { replace: true });
		}
	}, [location.state, navigate]);

	useEffect(() => {
		if (currentUser.id) {
			fetchConversations();
			socket.emit("join", currentUser.id);
		}

		socket.on("receive_message", (msg) => {
			// Only add to messages if the message is for the currently selected conversation
			if (
				selectedConversation &&
				((msg.from === selectedConversation.otherUser._id &&
					msg.to === currentUser.id) ||
					(msg.to === selectedConversation.otherUser._id &&
						msg.from === currentUser.id))
			) {
				setMessages((prev) => [...prev, msg]);
			}
			// Always update the sidebar
			updateConversationWithNewMessage(msg);
		});

		return () => {
			socket.off("receive_message");
		};
	}, [currentUser.id, selectedConversation]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const fetchConversations = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`${BACKEND_URL}/messages/conversations/${currentUser.id}`
			);
			if (response.ok) {
				const data = await response.json();
				setConversations(data);
			}
		} catch (error) {
			console.error("Error fetching conversations:", error);
		} finally {
			setLoading(false);
		}
	};

	const startConversation = async (otherUserId, otherUsername) => {
		try {
			// Check if conversation already exists
			const existingConversation = conversations.find(
				(conv) => conv.otherUser._id === otherUserId
			);

			if (existingConversation) {
				setSelectedConversation(existingConversation);
				await loadMessages(otherUserId);
			} else {
				// Create new conversation
				const newConversation = {
					otherUser: {
						_id: otherUserId,
						username: otherUsername,
					},
					lastMessage: null,
					unreadCount: 0,
				};

				setConversations((prev) => [newConversation, ...prev]);
				setSelectedConversation(newConversation);
				await loadMessages(otherUserId);
			}
		} catch (error) {
			console.error("Error starting conversation:", error);
		}
	};

	const loadMessages = async (otherUserId) => {
		try {
			const response = await fetch(
				`${BACKEND_URL}/messages/${currentUser.id}/${otherUserId}`
			);
			if (response.ok) {
				const data = await response.json();
				setMessages(data);
			}
		} catch (error) {
			console.error("Error loading messages:", error);
		}
	};

	const sendMessage = async () => {
		if (!input.trim() || !selectedConversation) return;

		const msg = {
			from: currentUser.id,
			to: selectedConversation.otherUser._id,
			message: input,
			timestamp: new Date(),
		};

		try {
			// Send via socket
			socket.emit("send_message", msg);

			// Add to local state
			setMessages((prev) => [...prev, msg]);

			// Persist to database
			await fetch(`${BACKEND_URL}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(msg),
			});

			setInput("");

			// Refetch conversations so the new chat appears in the sidebar
			fetchConversations();
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const updateConversationWithNewMessage = (msg) => {
		setConversations((prev) =>
			prev.map((conv) => {
				if (
					conv.otherUser._id === msg.from ||
					conv.otherUser._id === msg.to
				) {
					return {
						...conv,
						lastMessage: msg,
						unreadCount:
							selectedConversation?.otherUser._id ===
							conv.otherUser._id
								? 0
								: conv.unreadCount + 1,
					};
				}
				return conv;
			})
		);
	};

	const selectConversation = async (conversation) => {
		setSelectedConversation(conversation);
		await loadMessages(conversation.otherUser._id);

		// Mark as read
		setConversations((prev) =>
			prev.map((conv) =>
				conv.otherUser._id === conversation.otherUser._id
					? { ...conv, unreadCount: 0 }
					: conv
			)
		);
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className={styles.messagesPage}>
				<Sidebar />
				<div className={styles.mainContent}>
					<h1>Loading conversations...</h1>
				</div>
			</div>
		);
	}

	// Deduplicate conversations by otherUser._id, keeping the latest one
	const uniqueConversations = [];
	const seen = new Set();
	for (const conv of conversations) {
		if (
			conv.otherUser._id !== currentUser.id &&
			!seen.has(conv.otherUser._id)
		) {
			uniqueConversations.push(conv);
			seen.add(conv.otherUser._id);
		}
	}

	return (
		<div className={styles.messagesPage}>
			<Sidebar />

			<div className={styles.mainContent}>
				{selectedConversation === null &&
				uniqueConversations.length === 0 ? (
					<div className={styles.blankText}>
						You don't have any messages or chats with anyone yet!
						<br />
						To chat with other users, you need to first make them an
						offer for one of their items!
					</div>
				) : (
					<>
						<div className={styles.conversationsList}>
							{uniqueConversations.map((conversation) => (
								<div
									key={conversation.otherUser._id}
									className={`${styles.conversationItem} ${
										selectedConversation?.otherUser._id ===
										conversation.otherUser._id
											? styles.selected
											: ""
									}`}
									onClick={() =>
										selectConversation(conversation)
									}
								>
									<div className={styles.pfp}>
										<img
											src={conversation.otherUser.profilePicture
												? `http://localhost:3001/static/${conversation.otherUser.profilePicture}`
												: defaultProfileImage}
											alt="profile pic"
										/>
									</div>
									<h4>{conversation.otherUser.username}</h4>
								</div>
							))}
						</div>

						<div className={styles.chatArea}>
							{selectedConversation ? (
								<>
									<div className={styles.messagesContainer}>
										{messages.map((msg, idx) => (
											<div
												key={idx}
												className={`${styles.message} ${
													msg.from === currentUser.id
														? styles.sent
														: styles.received
												}`}
											>
												{msg.from === currentUser.id ? (
													<>
														<div
															className={
																styles.messageTime
															}
														>
															{formatTime(
																msg.timestamp
															)}
														</div>
														<div
															className={
																styles.messageContent
															}
														>
															{msg.message}
														</div>
													</>
												) : (
													<>
														<div
															className={
																styles.messageContent
															}
														>
															{msg.message}
														</div>
														<div
															className={
																styles.messageTime
															}
														>
															{formatTime(
																msg.timestamp
															)}
														</div>
													</>
												)}
											</div>
										))}
										<div ref={messagesEndRef} />
									</div>

									<InMessageTradePanel
										currentUser={currentUser.id}
										otherUser={
											selectedConversation?.otherUser._id
										}
									/>

									<div className={styles.inputArea}>
										<input
											type="text"
											value={input}
											onChange={(e) =>
												setInput(e.target.value)
											}
											onKeyDown={(e) =>
												e.key === "Enter" &&
												sendMessage()
											}
											placeholder="Type a message..."
											className={styles.messageInput}
										/>
										<button
											onClick={sendMessage}
											className={styles.sendButton}
										>
											<SendIcon />
										</button>
									</div>
								</>
							) : (
								<div className={styles.blankText}>
									<h2>
										Select a conversation to start chatting
									</h2>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Messages;
