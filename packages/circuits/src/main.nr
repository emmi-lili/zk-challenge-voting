use std::hash::poseidon::bn254::hash_1;
use std::hash::poseidon::bn254::hash_2;
////// Checkpoint 4 //////
// use binary_merkle_root::binary_merkle_root;

fn main(
    // public inputs
    nullifier_hash: pub Field,
    // private inputs
    nullifier: Field,
    secret: Field,
    ////// Checkpoint 4 //////
    // // public inputs
    // root: pub Field,
    // vote: pub bool,
    // depth: pub u32,
    // // private inputs
    // index: Field,
    // siblings: [Field; 16],
) {
    ////// Checkpoint 3 //////
    // Step 1: Recompute the nullifier_hash from the private nullifier
    let computed_nullifier_hash: Field = hash_1([nullifier]);
    
    // Step 2: Assert it matches the public nullifier_hash
    assert(computed_nullifier_hash == nullifier_hash);
    
    // Step 3: Build the commitment by hashing nullifier + secret
    let commitment: Field = hash_2([nullifier, secret]);

    ////// Checkpoint 4 //////

}
