// Retrieves jobs by department from the Greenhouse API and appends them to the document
// By Erik Teichmann, Awesome Dude
( function($) {

  // Helper function for excerpts
  function wordTrim(value, length, overflowSuffix) {
      if (value.length <= length) return value;
      var strAry = value.split(' ');
      var retLen = strAry[0].length;
      for (var i = 1; i < strAry.length; i++) {
          if(retLen == length || retLen + strAry[i].length + 1 > length) break;
          retLen+= strAry[i].length + 1
      }
      return strAry.slice(0,i).join(' ') + (overflowSuffix || '');
  }

  // Helper function strips nastiness out of responses from API
  function prepareContent(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    var stripped = txt.value.replace(/<(?:.|\n)*?>/gm, '');
    return wordTrim( stripped, 160, '...' );
  }

  // SET YOUR BOARD ID HERE
  var boardID = 'XXX';

  // Set up the endpoint URLs
  var departmentsURL = 'https://api.greenhouse.io/v1/boards/'+boardID+'/departments';
  var jobsURL = 'https://api.greenhouse.io/v1/boards/'+boardID+'/jobs?content=true';
  
  // Set the container to load jobs into
  var container = $('.jobs--container');

  // Set up template
  var template = '';
  $.get('template.html', function( templates ) {
    template = $(templates).filter('#greenhouse--template').html();
  });
  
  // Fetch jobs from server
  $.getJSON( jobsURL, function( data ) {
    // Get the master list of jobs
    var jobs = data.jobs;

    // Fetch departments from server
    $.getJSON( departmentsURL, function( data ) {
    
      // Set up an empty array to store the final list of departments in
      departments = [];
   
      // Loop the departments data
      $.each( data.departments, function( key, val ) {
        
        // Set up empty array for jobs from this dept
        deptJobs = [];

        // Loop through the jobs object and grab jobs from this dept
        $.each( jobs, function( i, v ) {
          // Only put the job in the array if the department IDs match
          if( val.id == v.departments[0].id ) {
            deptJobs.push({
              id: v.id,
              title: v.title,
              location: v.location.name,
              absolute_url: v.absolute_url,
              content: prepareContent( v.content )
            });
          }
        });

        // Build the department object
        var department = {
          id: val.id,
          name: val.name,
          jobs: deptJobs
        }

        // Add the department to the array
        departments[val.id] = department;
        
        // Only append the content if there are jobs in this department
        if( department.jobs.length > 0 ) {
          var rendered = Mustache.render( template, department );
          container.append(rendered);
        }
      });
    });
  });

})(jQuery);