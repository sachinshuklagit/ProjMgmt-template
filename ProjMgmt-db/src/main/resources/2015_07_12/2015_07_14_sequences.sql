
-- Sequences
db.sequences.insert({_id: "user_seq",seq: NumberLong(0), increment_by:NumberLong(1)});

db.sequences.insert({_id: "organization_seq",seq: NumberLong(0), increment_by:NumberLong(1)});

db.sequences.insert({_id: "post_seq",seq: NumberLong(0), increment_by:NumberLong(1)});

-- Function to get the next sequence

function getNextSequence(name) {
	   var t = db['sequences'].findOne({_id : name}, {_id:NumberLong(0), increment_by:NumberLong(1)});
	   var ret = db['sequences'].findAndModify(
	          {
	            query: { _id: name },
	            update: { $inc: { seq: t.increment_by } },
	            new: true
	          }
	   );
 return ret.seq;
};