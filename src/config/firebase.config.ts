import firebase from 'firebase-admin'

const serviceAccount: any = {
  type: 'service_account',
  project_id: 'test-5a399',
  private_key_id: 'add72fb479dd4f12a7d160ac5eecc58a75921531',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJNQl5PgcibT3j\nJiaBBcjCSIR8XwikHt8lRrjcawH9n2/pdSBNE7cZyBXmKkl1J33X5B9m9YhePxP+\nh7r5upOhIMAsPawQJCBJNk/Jm8A4yluFwrat8I1Ov74oHDKVc6r/632m9QrLkDSu\nzZ3ubyaIpY6ZZJvPUcQ+lgnrwYqCuhOnXhfSvKprRMsWHS19Mqksxwu1Sc6RinUl\nXkAE9B0rFjRAeOeX7+aI0Pq+0cmkh2tnUX53Vx/L8yg8T2Vt2D1qrTfgOCwTcv4z\nf+52/D+KrBv3dd6CJwEmLvYLWIr34DGVVzjCZrq2zYNH9kQcQlRnHxiRftPlLQDA\n+PlpflXrAgMBAAECggEADjRYVDQ00hFe6nJUYDdwUjGcaMtXaNQPx38+qGZFiwop\nHxTNuvicAeNGPdbZE2mTphzMurq1bdyLeiSgO+Ztav/3kSf+xa+cjTlFrg340V7i\nfIb1Lpe/jMJXQlhQmeHDPgiko5duXlXyjNn8lEtJ2nZq+BlKMVCscglVmfcyjW1F\nTSdlkx6o3J4Vb1bxqlbF8u8E1LlIsWe7imVVaj3hw8d9odNnNhNIMK7XPLHktk7B\ngmk2W0fMYed56ValK0GL/v1SIBSdvOe4wr0hHFtusuUHu0w6z6iscoFCiOwdNxyW\nLws+3mf4aEOZtGncyoMVoaXDFM50V+sqYhKEwiHRwQKBgQD8FP6sbG38vyO55L1T\n8sQ28ks7QIvRYEtE4tjCdMMSJ7rbPZK+rqOPyOYsjvEqHmOhP3tp39DVZ0NGkqgK\np6F+1H6ptw4Vb7p9PW6CXKupPCw5xXJIgOl4b3hLBnWR1clp5mWg3cuLiHwcMtWU\n7D/EheFcfPKtwJ0LPkYV70AxnwKBgQDMVZ36PJyDJOI+oiffXyzFNHRNXygSu8Xs\naptWoihpNLd9Fp0QoZkpO3h1UEamcp5qCSSI6Hv7EIRwJr7lzyNPKAlPmHywmRcQ\nr82hlNNLl1SnTfoZjV416NwpfyIUi+40q3iR5kshTFgUv6Vpvoz01m4EYqoJwW+E\no8YihPHwNQKBgQDwmrVuK9xbRrE56GsRaoEAFQnbl0Mc6HVPXdoY2MusU4GVa1La\nb+QsBEw2MYVcdz8PFIGeT4OLfRGIlciQyulpHjd7k/58VXVBvtXw1bT/RjDMP3pS\nW8D8NCE0Mwka1lx1mPRds/VozC/x1k9n4osG7+ZnmdckItmCdsD8hKzX7wKBgBLQ\nJzVs8zQX50TBBU7JooOdqr+c7UGcTELSJe86CuJ02hgIRvnLByEGuraCZ57XmsJE\niTqZvSCGissQpi7efW/CTekoLwLLdZYxuYsQ+stQ6Zhl04sauvvXrr2bWPXvVEVB\nLF6yh2RPdSSj6ITt6Gh6fbKlquYvCyd5NLrk5qmpAoGAQOA9AR5Z63y3jxYv4Am8\naar558uXoeq9scDX5wct/9QjjTbapu4iKlGFsFF630PeZ87GyDHAryR9jVf+FzA3\nP4JPjqvIrUju5S1JALg4Bq2QZO03sZ8sUZxQTGyKrvuOllWESuSsUJ1NzVWItegn\njdYHfKqDn7w7PE9MqZDqE9c=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-ybx0y@test-5a399.iam.gserviceaccount.com',
  client_id: '111457681310048021333',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ybx0y%40test-5a399.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
}

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

export default firebase
