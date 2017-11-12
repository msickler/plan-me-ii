class TripSerializer < ActiveModel::Serializer
  attributes :id, :name, :content, :categories, :user_id
  belongs_to :user
  has_many :categories, :through => :trip_categories
  has_many :comments


  private
    #def comments
    #  CommentSerializer.new(object.comments).attributes
    #end
end
