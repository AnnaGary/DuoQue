import Users from './users.js'; // Adjust the path if needed

export async function handleLikeRequest(req, res) {
  try {
    // Gather request body
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      const { fromUserId, toUserId } = JSON.parse(body);

      // Validate user IDs
      if (!fromUserId || !toUserId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Missing user IDs.' }));
      }

      // Fetch the "liker"
      const fromUser = await Users.findById(fromUserId);
      if (!fromUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User not found.' }));
      }

      // Avoid duplicate likes
      if (!fromUser.likes.includes(toUserId)) {
        fromUser.likes.push(toUserId);
        await fromUser.save();
      }

      // Optional: check for a match
      const toUser = await Users.findById(toUserId);
      const isMutual = toUser?.likes.includes(fromUserId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: isMutual ? 'It’s a match! 🎉' : 'You liked this profile!',
        match: isMutual
      }));
    });
  } catch (err) {
    console.error('❌ Like error:', err); 
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Server error' }));
  }
}