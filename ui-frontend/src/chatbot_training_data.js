// only run/execute this script once unless you intend to add more training data if needed
const { NlpManager } = require("node-nlp");
const Filter = require("bad-words");

// Initialize the NLP manager
const manager = new NlpManager({ languages: ['en'] });
const filter = new Filter();

const addDocumentWithFilter = (language, utterance, intent) => {
    const cleanUtterance = filter.clean(utterance);
    manager.addDocument(language, cleanUtterance, intent);
};

// Add documents
addDocumentWithFilter('en', 'hello', 'greeting');
addDocumentWithFilter('en', 'hi', 'greeting');
addDocumentWithFilter('en', 'hey there', 'greeting');
addDocumentWithFilter('en', 'good morning', 'greeting');
addDocumentWithFilter('en', 'good afternoon', 'greeting');
addDocumentWithFilter('en', 'goodbye', 'greetings.bye');
addDocumentWithFilter('en', 'the courses', 'courses');
addDocumentWithFilter('en', 'what courses are available', 'courses');
addDocumentWithFilter('en', 'available courses', 'courses');
addDocumentWithFilter('en', 'how to register', 'register');
addDocumentWithFilter('en', 'i need help to register', 'register');
addDocumentWithFilter('en', 'help on registration', 'register');
addDocumentWithFilter('en', 'offer assistance on how to register', 'register');
addDocumentWithFilter('en', 'i need help', 'general');
addDocumentWithFilter('en', 'help', 'general');
addDocumentWithFilter('en', 'what features does this platform offer', 'features.other');
addDocumentWithFilter('en', 'list features', 'features.other');
addDocumentWithFilter('en', 'who are you', 'about');
addDocumentWithFilter('en', 'how are you', 'greetings.condition');

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
manager.addAnswer('en', 'register', "I'm happy to offer assistance on registraion! All you need to do to register is simply copy both the course ID and the title and email it to registration@ITLite.co.za together with your proof of payment and we'll get back to you shortly afterwards!");
manager.addAnswer('en', 'general', "Are you looking for any help? I'm here to offer assistance! If you want to know more about how to register please ask me! Or if your question is related to something different you can type it in the chat window as well.");
manager.addAnswer('en', 'features.other', 'Some of the primary features that this platform offers its users are blogging, course rating and it also provides some neat Twitter feeds!')
manager.addAnswer('en', 'about', "Just think of me as a general chatbot designed for this platform alone so coincidentally I'm more of an app-centric bot focused on providing feedback mostly aimed at and around the context of this platform.");
manager.addAnswer('en', 'about', "I'm an app-centric bot meaning that I can help you with stuff around the context of this site.");

manager.train().then(() => {
    manager.save();
    console.log('Model trained and saved successfully.');
});