export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Consume the request stream but discard the data
    req.on('data', () => {});
    req.on('end', () => {
      res.status(200).json({ ok: true });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
