const mongoose = require('mongoose');

const SketchSchema = mongoose.Schema({
	created: Date,
	// TODO look into better practices for storing source code in a database
	sourceCode: String
});

const Sketch = mongoose.model('Sketch', SketchSchema);
module.exports = Sketch;
