import { findUserById, updateUser } from './index.js';

export async function handleLikeRequest(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', async () => {
    try {
      const { fromUserId, toUserId } = JSON.parse(body);
      if (!fromUserId || !toUserId || fromUserId === toUserId) {
        return res.end(JSON.stringify({ message: 'Invalid like request.' }));
      }

      const fromUser = await findUserById(fromUserId);
      const alreadyLiked = fromUser.matches.some(m => m.userId.toString() === toUserId);
      console.log(`User ${fromUserId} → ${alreadyLiked ? 'UNLIKE' : 'LIKE'} → ${toUserId}`);

      let updatedMatches;
      if (alreadyLiked) {
        // Unlike
        updatedMatches = fromUser.matches.filter(m => m.userId.toString() !== toUserId);
      } else {
        // Like
        updatedMatches = [...fromUser.matches, { userId: toUserId, status: 'pending' }];
      }

      await updateUser(fromUserId, { matches: updatedMatches });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: alreadyLiked ? 'User unliked' : 'User liked',
        liked: !alreadyLiked
      }));
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Server error' }));
    }
  });
}