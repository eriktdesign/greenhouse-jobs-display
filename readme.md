# Display Greenhouse.io Jobs with a Mustaches Template

## How to use
Include the following in the footer of your HTML

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js"></script>
<script src="greenhouse-jobs-display.js"></script>
```

Then add an empty div with the class "greenhouse--jobs" to your HTML where you would like the jobs to appear.

```
<div class="jobs--container"></div>
```

Edit the JS file to set your Greenhouse board ID on line 26.

```
var boardID = 'XXX'; // your id goes here
```

On loading the page, all your jobs are pulled into the .jobs--container div. Presto!

Edit the template.html file to change the markup that is used for jobs.