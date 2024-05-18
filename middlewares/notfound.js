// middlewares/notfound.js

const notfound = (req, res) => {
    res.status(404).json({ error: 'meher ferjani' });
  };
  
  export { notfound };
  