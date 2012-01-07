(function(undefined) {
  window.Filter = Backbone.Model.extend({
    defaults: {
      filter: {}
    },

    initialize: function() {
      // apply filter when data or filter changes
      this.bind('change:data', function() {
        this.run();
      });
      this.bind('change:filter', function() {
        this.run();
      });
    },
  
    add: function(filter) {
      newFilter = this.get('filter');
      newFilter[filter.field] = {
        min: filter.min,
        max: filter.max
      };
      this.set({filter: newFilter});
      this.trigger('change:filter');  // why necessary?
    },

    remove: function(key) {
      newFilter = this.get('filter');
      delete newFilter[key];
      this.set({filter: newFilter});
      this.trigger('change:filter');  // why necessary?
    },

    run: function() {
      var self = this;
      var filtered = _(self.get('data')).filter(function(d,k) {
        return self.check(d);
      });
      this.set({filtered: filtered});
    },

    outliers: function() {
      var self = this;
      var leftovers = _(self.get('data')).reject(function(d,k) {
        return self.check(d);
      });
      if (_(leftovers).size() === 0) {
        if (!confirm("This will remove all the data. Are you sure about this?"))
          return false;
      }
      self.set({data: leftovers});
      self.clearFilter();
    },
    
    inliers: function() {
      var self = this;
      var leftovers = _(self.get('data')).filter(function(d,k) {
        return self.check(d);
      });
      if (_(leftovers).size() === 0) {
        if (!confirm("This will remove all the data. Are you sure about this?"))
          return false;
      }
      self.set({data: leftovers});
      self.clearFilter();
    },
    
    clearFilter: function() {
      this.set({filter: {}});
      this.trigger('change:filter');  // why necessary?
    },

    check: function(d) {
      var filter = this.get('filter')
      for (key in this.get('filter')) {
        if ((d[key] < filter[key].min) || (d[key] > filter[key].max))
          return false;
      }
      return true;
    }

  });
  
  window.Selector = Backbone.Model.extend({
    defaults: {
      selected: null
    },
    select: function(i) {
      this.set({'selected': i});
    },
    deselect: function() {
      this.unset('selected');
    },

  });
})();
