// only run/execute this script once unless you intend to add more training data if needed

const { NlpManager } = require("node-nlp");

// Initialize the NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Add documents
manager.addDocument('en', 'hello', 'greeting');
manager.addDocument('en', 'hi', 'greeting');
manager.addDocument('en', 'hey there', 'greeting');
manager.addDocument('en', 'good morning', 'greeting');
manager.addDocument('en', 'good afternoon', 'greeting');
manager.addDocument('en', 'goodbye', 'greetings.bye');
manager.addDocument('en', 'the courses', 'courses');
manager.addDocument('en', 'how are you', 'greetings.condition');

// Add answers
manager.addAnswer('en', 'greeting', 'Hi!');
manager.addAnswer('en', 'greeting', 'Hey there!');
manager.addAnswer('en', 'greeting', 'Hello.');
manager.addAnswer('en', 'greeting', 'Whatsup!');
manager.addAnswer('en', 'greetings.bye', 'Bye! Until next time!');
manager.addAnswer('en', 'greetings.condition', "As a chatbot, I don't have feelings but generally you can think of me as being well and superb!");
manager.addAnswer('en', 'greetings.bye', 'Goodbye!');
manager.addAnswer('en', 'courses', "You can view all the available courses on the main page.");
manager.addAnswer('en', 'courses', "If you're interested in viewing courses then that would be on the main page. Let me know if you would like help on how to register.");

manager.train().then(() => {
    manager.save();
    console.log('Model trained and saved successfully.');
});