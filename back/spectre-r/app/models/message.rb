class Message
  include Mongoid::Document
  include Mongoid::Timestamps
  field :from, type: String
  field :to, type: String
  field :msg, type: String
  field :when, type: Timestamp
end
