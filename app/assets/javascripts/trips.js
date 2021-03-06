// Next Trip
$(function() {
  $('.js-next').on('click', function() {
    const currentId = parseInt($(".js-next").attr("data-id"))
    const nextId = currentId + 1;
    $.get("/trips/" + nextId + ".json", function(tripJSON) {
      const trip = new Trip(tripJSON);
      trip.renderNext()
    })
    $(".comments").html("")
    $(".newComment").html("")
    $(".js-next").attr("data-id", nextId)
    $(".tripName").attr("href", `/trips/${nextId}`)
   $(".load_categories").attr("href", `${nextId}/categories`)
   $(".load_comments").attr("href", `${nextId}/comments`)
   const newAction = $(".new_comment").attr("action").replace(currentId, nextId)
   $(".new_comment").attr("action", newAction)
  })
})

// JS Constructor - Trip
function Trip(attributes) {
  this.id = attributes.id
  this.name = attributes.name
  this.categories = attributes.categories
  this.content = attributes.content
  this.user = attributes.user
}
// Prototype method
Trip.prototype.formatLink = function() {
  let tripHTML = `<a href="/trips/${this.id}" data-id=${this.id}>${this.name}</a><br>`
  return tripHTML
}

// Trip Categories
function parseJson(object){
    object.forEach(function(key) {
      console.log(key.name);
      let categoriesList = `Name: ${key.name}`
      return categoriesList
    });
}

// Trip Render Next
Trip.prototype.renderNext = function() {
  const categoriesNames = this.categories;

  function parseJson(categoriesNames){
    catsList = "Filed under:"
    for (var i = 0; i < categoriesNames.length; i++){
      catsList += " " + "<a href='/categories/" + categoriesNames[i]["id"] + "'> " + categoriesNames[i]["name"] + "</a>" + " " + "|"
    }
  }
  parseJson(categoriesNames);

	$(".tripName").text(this.name)
	$(".tripCategories").html(`${catsList}`)
	$(".tripContent").text(this.content)
	$(".tripUser").text(this.user.name)
  $(".user_link").attr("href", `/users/${this.user.id}`)
  $(".edit_trip").attr("href", `/trips/${this.id}/edit`)
  $(".delete_trip").attr("href", `/trips/${this.id}`)
  $(".load_comments").attr("data-id", this.id)
  $(".comments").html("")
  $(".load_categories").attr("href", `/trips/${this.id}/categories`)
  $(".categories").html("")
  $("#form").attr("action", `/trips/${this.id}/comments`)
  $("#tripId").val(this.id)
}

// Load Comments
$(function() {
  $("a.load_comments").on("click", function(e) {
    const id = parseInt($(".load_comments").attr("data-id"))
    $.get("/trips/" + id + "/comments" + '.json', function (comments) {
      comments.forEach(function(comment) {
        const oneComment = new Comment(comment)
        const commentHTML = oneComment.formatComment()
        $(".comments").append(commentHTML)
      })
    });
    $("a.load_comments").attr("href", "");
    e.preventDefault();
  })
})

// JS Constructor - Comment
function Comment(comment) {
  this.id = comment.id
  this.text = comment.text
  this.trip = comment.trip
}

// Prototype method
Comment.prototype.formatComment = function() {
  commentHTML = `<li data-id=${this.id}><b>On ${this.trip.name}:</b> ${this.text} </li>`
  return commentHTML
}

// Submit Comment via Rails API
$(function() {
  $(".new_comment").on("submit", function(e){
    $.post(this.action, $(this).serialize(), function(comment) {
      if (Array.isArray(comment)) {
        var message = "";
        comment.forEach(function(error) {
          message += `${error}\n`
        })
        alert(message);
      } else {
        const $ol = $(".newComment");
        const newComment = new Comment(comment);
        const commentHTML = newComment.formatComment();
        $ol.append(commentHTML);
      }
      $("#comment_text").val("");
    });
    e.preventDefault();
    })
 })
