var mongoose = require('mongoose');

var HighlightsLikeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var CommentLikeSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    CommentId: { type : String , required : true },
    CommentUserId: { type : String , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);


var QuestionsRatingSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    PostUserId: { type : String , required : true },
    Rating: { type : Number , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var AnswerRatingSchema = mongoose.Schema({
    UserId: { type : String , required : true },
    PostId: { type : String , required : true },
    AnswerId: { type : String , required : true },
    AnswerUserId: { type : String , required : true },
    Rating: { type : Number , required : true },
    Date: { type : String , required : true },
    ActiveStates: String
    }, 
    { timestamps: true }
);

var varHighlightsLike = mongoose.model('HighlightsLike', HighlightsLikeSchema, 'HighlightsLike');
var varCommentLike = mongoose.model('CommentLike', CommentLikeSchema, 'CommentLike');

var varQuestionsRating = mongoose.model('QuestionsRating', QuestionsRatingSchema, 'QuestionsRating');
var varAnswerRating= mongoose.model('AnswerRating', AnswerRatingSchema, 'AnswerRating');

module.exports = {
    HighlightsLike : varHighlightsLike,
    CommentLike : varCommentLike,
    QuestionsRating : varQuestionsRating,
    AnswerRating : varAnswerRating
};