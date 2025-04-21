import { findUserById, updateUser } from './index.js';

export async function handleLikeRequest(req, res) {
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', err => reject(err));
    });

    const { fromUserId, toUserId } = body;

    if (!fromUserId || !toUserId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Missing user ID(s)' }));
      return;
    }

    const fromUser = await findUserById(fromUserId);
    if (!fromUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    const isAlreadyLiked = fromUser.matches.includes(toUserId);

    let updatedMatches;
    let message;

    if (isAlreadyLiked) {
      // Unlike user
      updatedMatches = fromUser.matches.filter(id => id !== toUserId);
      message = 'User unliked';
    } else {
      // Like user
      updatedMatches = [...fromUser.matches, toUserId];
      message = 'User liked';
    }

    await updateUser(fromUserId, { matches: updatedMatches });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message }));

  } catch (err) {
    console.error('Like error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Server error' }));
  }
}