async function generateKey() {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // AES-256 key (you can also choose 128 or 192)
    },
    true, // Whether the key is extractable (can be used for export)
    ["encrypt", "decrypt"] // The key can be used for encryption and decryption
  );
  return key;
}

// Function to generate a random initialization vector (IV)
async function generateIv() {
  // AES-GCM requires a 12-byte IV (recommended length)
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv); // Fill the array with cryptographically secure random values
  return iv;
}

export async function encryptData(data) {
  const key = await generateKey();
  const iv = await generateIv();
  const encodedData = new TextEncoder().encode(data);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  // Combine the IV with the encrypted data to make it easier to decrypt later
  const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
  combinedData.set(iv, 0);
  combinedData.set(new Uint8Array(encryptedData), iv.length);

  // The encrypted data (including the IV) needs to be transferred as a binary format
  // For simplicity, we can return it as a base64 string
  return window.btoa(String.fromCharCode.apply(null, combinedData));
}

export async function decryptData(encryptedData, key) {
  // Split the base64 string back to binary format
  const binaryData = Uint8Array.from(atob(encryptedData), (char) =>
    char.charCodeAt(0)
  );
  // The IV was stored as the first 12 bytes of the encrypted data
  const iv = binaryData.slice(0, 12);
  const data = binaryData.slice(12);

  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new TextDecoder().decode(decryptedData);
}
