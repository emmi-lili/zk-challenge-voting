use std::hash::poseidon::bn254::hash_1;
use std::hash::poseidon::bn254::hash_2;
////// Checkpoint 4 //////
use binary_merkle_root::binary_merkle_root;

fn main(
    // public inputs
    nullifier_hash: pub Field,
    // private inputs
    nullifier: Field,
    secret: Field,
    ////// Checkpoint 4 //////
    // public inputs
    root: pub Field,
    vote: pub bool,
    depth: pub u32,
    // private inputs
    index: Field,
    // max of 2^16 leaves --> 65536 leaves
    siblings: [Field; 16],
) {
    ////// Checkpoint 3 //////
    // Step 1: Recompute the nullifier_hash from the private nullifier
    let computed_nullifier_hash: Field = hash_1([nullifier]);
    
    // Step 2: Assert it matches the public nullifier_hash
    assert(computed_nullifier_hash == nullifier_hash);
    
    // Step 3: Build the commitment by hashing nullifier + secret
    let commitment: Field = hash_2([nullifier, secret]);

    ////// Checkpoint 4 //////
    
    // Step 4: Count non-zero siblings to get the actual path length
    let mut siblings_num = 0;
    for i in 0..siblings.len() {
        if siblings[i] != 0 {
            siblings_num += 1;
        }
    }
    
    // Step 5: Safety check - depth can't exceed array length
    assert(depth <= siblings.len());
    
    // Step 6: Convert leaf index to 16 little-endian bits
    // Each bit tells us if we're on the left (0) or right (1) at that level
    let index_bits: [u1; 16] = index.to_le_bits();
    
    // Step 7: Compute the Merkle root from commitment + siblings
    let computed_root = binary_merkle_root(hash_2, commitment, siblings_num, index_bits, siblings);
    
    // Step 8: Assert computed root matches the public root
    assert(computed_root == root);
    
    // Step 9: Bind the vote to the proof (prevents front-running)
    // Cast vote to Field and enforce x*x = x (only true for 0 and 1)
    let vote_field = vote as Field;
    assert((vote_field * vote_field) == vote_field);
}
