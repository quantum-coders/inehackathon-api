import AttachmentService from './attachment.service.js';
import AiService from '../../services/ai.service.js';

class AttachmentController {

	/**
	 * Views an attachment by redirecting to its URL.
	 *
	 * @param {object} req - The request object containing the attachment ID.
	 * @param {object} res - The response object for sending the results.
	 * @returns {void}
	 * @throws {Error} - Throws an error if parameters are invalid or if there is a service error.
	 */
	static async viewAttachment(req, res) {
		try {
			const { id } = req.params;

			// Validate input parameter
			if(!id) {
				return res.respond({
					status: 400,
					message: 'Attachment ID is required.',
				});
			}

			// Fetch the URL of the attachment by ID
			const url = await AttachmentService.viewFile(id);

			// Validate output from AttachmentService
			if(!url) {
				return res.respond({
					status: 404,
					message: 'Attachment not found.',
				});
			}

			// Redirect to the URL
			res.redirect(url);

		} catch(error) {
			// Handle errors and send appropriate response
			console.error('Error viewing attachment:', error);
			res.respond({
				status: 500,
				message: 'Error viewing attachment: ' + error.message,
			});
		}
	}

	/**
	 * Analyzes an attachment using AI services.
	 *
	 * @param {object} req - The request object containing the attachment ID.
	 * @param {object} res - The response object for sending the results.
	 * @returns {void}
	 * @throws {Error} - Throws an error if parameters are invalid or if there is a service error.
	 */
	static async analyzeAttachment(req, res) {
		try {
			const { id } = req.params;

			// Validate input parameter
			if(!id) {
				return res.respond({
					status: 400,
					message: 'Attachment ID is required.',
				});
			}

			// Fetch attachment by ID
			const attachment = await AttachmentService.findById(id);

			// Validate output from AttachmentService
			if(!attachment) {
				return res.respond({
					status: 404,
					message: 'Attachment not found.',
				});
			}

			// Analyze the attachment using AI service
			const analysis = await AiService.analyzeAttachment(attachment);

			// Validate output from AiService
			if(!analysis) {
				res.respond({
					status: 500,
					message: 'Error analyzing attachment.',
				});
			}

			// Respond with the analysis result
			res.respond({
				status: 200,
				data: analysis,
			});

		} catch(error) {
			// Handle errors and send appropriate response
			console.error('Error analyzing attachment:', error);
			res.respond({
				status: 500,
				message: 'Error analyzing attachment: ' + error.message,
			});
		}
	}

	static async ocrAttachment(req, res) {
		try {
			const id = req.params.id;
			const attachment = await AttachmentService.findById(id);

			if(!attachment) {

				res.respond({
					status: 404,
					message: 'Attachment not found',
				});
			}

			const result = await AiService.ocrAnalysis(attachment);

			res.respond({
				status: 200,
				data: result,
			});

		} catch(error) {
			res.respond({
				status: 400,
				message: 'Error analyzing attachment: ' + error.message,
			});
		}
	}

	static async getCredentialPhoto(req, res) {
		try {

			// check if we receive id
			const id = req.params.id;

			let photo;

			if(!!id) {
				photo = await AiService.getCredentialPhoto(id);
			} else {

				const attachment = req.body;
				photo = await AiService.getCredentialPhoto(attachment);
			}

			res.respond({
				status: 200,
				data: photo,
			});

		} catch(error) {
			res.respond({
				status: 400,
				message: 'Error creating credential photo: ' + error.message,
			});
		}
	}

	static async compareFaces(req, res) {
		try {
			const { id1, id2 } = req.body;

			const recognition = await AiService.compareFaces(id1, id2);

			res.respond({
				status: 200,
				data: recognition,
			});

		} catch(error) {
			res.respond({
				status: 400,
				message: 'Error comparing faces: ' + error.message,
			});
		}
	}
}

export default AttachmentController;