import firebase from 'firebase-admin'

const serviceAccount: any = {
  type: 'service_account',
  project_id: 'highlight-4d879',
  private_key_id: 'a447096b3277f1cd6cbf4ad90422aa3f9017f700',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDALs1UySeyWn3E\nl5Xun7+il4FsSccGf1wZ7kcbgvcwUiAJFXJcqPa8i7PnGnktIERu3b7ailDvHUvh\n0bWizReDWoYaDGA276/sCATBKhb/KR+52BQ/QLRCGZDIz//4vChtk0R/gLU/LwWr\nAGqibeO2RFg7bcwjt5dmTaMA4GcIC8vrBuU5wZBPmnqguaaBYg6Erd1gJTXKulxO\n32ELhao0Hf2p6Tba+vw4Lwd5LfujdiORgXkRzVqyDzxBqn2o34TvR+NmLlv1gfvj\n7oQcMR57q9LK3LfWea9o55Begrd+uKlSigirRHVv09w5v9CKf8Wf5TQAcCq9x1kx\nTVj5WsDnAgMBAAECggEADmoUPYU+5Ho0D7A87yJtObE6ZFheRKb9zfYYwEAA8U9f\nlr7Ujo2fwAGMc0uBhjhy2YvpOjQAoQal/+B+SqEuX8xE3aRK/SPaIo5xaNmS0v2P\nIx3JWvsr6f9H5D/xl4LpV1qh2xxYu833k11bIiay2yNiKMbx9kXZZbNyA+lQ4QH8\nJN5e3T/n+/rTJEPB16cMwsAY7VHsatK+h1E+i9WI7Jx7sZbmnC1i6TJa02XRGYjY\nE8KfWyTHg2vOeDgjo09fo3NHzvvjTRNlp7pE6Yk6ozgQFdX5vlmyHYKrlNf7nGzA\n3iZX61CHgaQuZrUWqZPcxmS1ePG9qGhOBXrGCCuDuQKBgQDuAT6ReLIepXXHuMNz\nmGdXi1XLiNv9P+V0KoISaDqOuxvLMnfnZjkgQIU/NdniJ+HybfuK9fLNt6bjM4tn\n3PlTi0ZSmBnZeXLEGMQA0OpvERK8MxpqeDdER2gclJeSCFzEYtZr6J0tz0tTe05s\ngZq4FOJM63HD8y8Bo4okxR8w+QKBgQDOtqOZOQn2oZYLhA0byotLNFu0wII8fNBO\nMJ16HubC7cbwqNXx49grxqRWtxG5OGX9tEUBkqrjoQwlSUC112iGtQVhS0vvJtiS\n5r8XG5A2noLwNwsAgcgBgGYpoDmbgb7bfSPra1FUsLhyGEgfv78yxFo41wHcCskr\nvVKHJQXY3wKBgFwLDShzFed2M7t+f8/3k5euogpprjIdgN5RBiaaOnMyd0g5B1ft\nF5Cagy1z5QRqSh5YXFxcS381VAwvxezv71hY12RfwDdzmWeu8DYklVVItAcmeEPO\npAj62I+dA5UNONsWIjhvKEIsFcR+PlEGOlCQewgmUcPnCznGBkm8Fhj5AoGAUV4Z\nFaYbIubGDjBjjI30uJyagJLKcQ7cW/rM8hYZ1Z8NEQwUcwuxusGNTMjxBAyMMQp1\no0HdXI63HjIwc6Of9G5q+LpP4IpU87Y6f9kMskNA3Vd9UCzF0rl8/WOhaXHv86vV\nqMRslj6dy+N8+Gpc05nwvbD8fWYNe9chFitfmtcCgYBlNgqnTuXacQoWbGQGaT5j\n4t6VD75KVncNsM0DaFJvE6IIJ9sd1nv1tI30GiJ4P61fk+L7L4dJO7V8JXhrtGcJ\nBShjaL/mrJV/YB5lguUYN0QwkcD1xR0W9E2ruapqF1w1yDulpNUdLexhhKhBJZXO\nYvpf6WU68yCPEzXGqYjJIg==\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-7cg2c@highlight-4d879.iam.gserviceaccount.com',
  client_id: '104627760386824657841',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7cg2c%40highlight-4d879.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
}

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

export default firebase
