import styles from "../styles/HelpModal.module.css";
import { Box, Modal, Typography } from "@mui/material";

function HelpModal({ open, handleClose, content }) {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="help-modal-title"
			aria-describedby="help-modal-description"
		>
			<Box className={styles.modalBox}>
				<Typography id="help-modal-title">
					Help
				</Typography>
				<Typography id="help-modal-description">
					{content}
				</Typography>
			</Box>
		</Modal>
	);
}

export default HelpModal;
