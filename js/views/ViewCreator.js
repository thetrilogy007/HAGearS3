var ViewCreator = (function() {
	
	// Item template
	var TEMPLATE = [
		'<li class="entity-list-item li-has-toggle %1" data-entity-id="%2">',
			'<label>',
		 			'<div class="name-container">',
						"%3",
					'</div>',
				'<div class="icon-container %4-icon-container">',
					'<div class="%4-icon-div"></div>',
				'</div>',
			'</label>',
		'</li>'].join('\n');
	
	/**
	 * Constructor
	 * @param entity The json object with all of the entity information
	 */
	function ViewCreator(entities) {
		this.entities = entities;
	}
	
	ViewCreator.prototype.create = function(metadata) {
		createDom(this.entities, metadata.name, metadata.title, metadata.selectedState);
		registerEventHandlers(metadata.select, metadata.deselect);
	};

	function createDom(entities, name, title, selectedState) {
		var filterString = name + ".";
		var filteredEntities = entities.filter(function(entity){
			if (entity.entity_id.startsWith(filterString)) {
				return true;
			}
		}).sort(function(entity1, entity2){
			if (entity1.attributes.friendly_name.toLowerCase() < entity2.attributes.friendly_name.toLowerCase()) return -1;
			if (entity1.attributes.friendly_name.toLowerCase() > entity2.attributes.friendly_name.toLowerCase()) return 1;
			return 0;
		});
		
		var domString = "";
		for (var i=0;i<filteredEntities.length;i++) {
			domString = domString + createListItem(filteredEntities[i], name, selectedState);
		}
		
		$('#entity-list').html(domString);
		$('#entity-list-title').html(title);
	}
	
	registerEventHandlers = function(select, deselect) {
		$('.entity-list-item').click(function(e) {
			var li = e.currentTarget;
			var entity_id = li.dataset.entityId;
			// We have to flip the value since the input has changed when we get the event
			var selected = li.classList.contains("selected");
			if (selected) {
				deselect(entity_id);
				li.classList.remove("selected");
			} else {
				select(entity_id);
				li.classList.add("selected");
			}
		});
	}
		
	// Create a dom string representing an entity in the list
	 function createListItem (entity, name, selectedState) {
		 var selected = entity.state === selectedState ? "selected" : "";
		 return TEMPLATE.replace(/%1/g, selected)
		 				.replace(/%2/g, entity.entity_id)
		 				.replace(/%3/g, entity.attributes.friendly_name)
		 				.replace(/%4/g, name);
	}
	
	return ViewCreator;
})();