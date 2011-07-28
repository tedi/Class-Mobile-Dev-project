var NotesApp = (function(){

	var App = {
		stores: {},
		views: {},
		collections: {}
	}
	
	// Initialize localStorage Data Store
	App.stores.notes = new Store('notes');
	
	
	// Note Model
	var Note = Backbone.Model.extend({
		// Use localStorage database
		localStorage: App.stores.notes,
		
		initialize: function() {
		
			if(!this.get('title')) {
				this.set({title: "Note @ " + Date() } )
			};
			
			if(!this.get('body')) {
				this.set({body: "No Content" } )
			};
		}
	})
	
	
	//Collections
	var NoteList = Backbone.Collection.extend({
	
		model: Note,
		
		localStorage: App.stores.notes,
		
		initialize: function() {
			var collection = this;
			this.localStorage.bind('update', function(){
				collection.fetch();
			})
		}
	
	})
	
	
	//Views
	var NewFormView = Backbone.View.extend({
		
		events: {
			"submit form": "createNote"
		},
		
		createNote: function(e) {
			var attrs = this.getAttributes(),
				note = new Note();
				
			note.set(attrs);
			note.save();
		},
		
		getAttributes: function() {
			return {
				title: this.$('form [name=title]').val(),
				body: this.$('form [name=body]').val()
			}
		}
	});
	
	//Represents a listview page display a collection of notes
	//Each in this view will be represented by a NoteListItemView
var NoteListView = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll')
		
			this.collection.bind('add', this.addOne);
			this.collection.bind('refresh', this.addAll);
			this.collection.fetch();
		},
		
		addOne: function(note) {
			var view = new NoteListItemView({
				model: note
			});
			$(this.el).append(view.render().el);
			
			if('mobile' in $){
				$(this.el).listview().listview('refresh');
			}
		},
		
		addAll: function() {
			$(this.el).empty();
			this.collection.each(this.addOne);
		}
    });
	var NoteListItemView = Backbone.View.extend({
		tagName: 'LI',
		template: _.template($('#note-list-item-template').html()),
		
		initialize: function() {
			_.bindAll(this, 'render')
			this.model.bind('change', this.render)
		},
		
		render: function() {
			$(this.el).html(this.template({ note: this.model }))
			return this;
		} 
		
	})
	
	window.Note = Note;
	
	App.collections.all_notes = new NoteList();
	
	App.views.list_alphabetical = new NoteListView ({
		el: $('#all_notes'),
		collection: App.collections.all_notes
	});
	
	App.views.new_form = new NewFormView({
		el: $('#new')
	});
	
	
	return App;

})();







