import { getRouter, auth, setupRoute } from '@thewebchimp/primate';
import web3Controller from '../controllers/web3.controller.js';
const router = getRouter();

const options = {};


router.post('/vote',  web3Controller.castVote);
router.post('/candidate', web3Controller.addCandidate);
router.get('/:id/candidate', web3Controller.getCandidate);
router.post('/mint', web3Controller.mintVoteProof);

export { router };