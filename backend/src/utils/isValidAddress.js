import { ethers } from 'ethers';

export default function isValidAddress(address) {
    try {
        let _addr = ethers.utils.getAddress(address);
        return true;
    } catch {
        return false;
    }
}
