/**
 * Created by Hans on 2017/7/2.
 */
var async = require('async');
var gitlab = require('gitlab')({
    url: 'http://192.168.5.252',
    token: 'ybFfyQQXqLAi8NgZ3J6i'
});

var markdown = require( "markdown" ).markdown;
console.log(markdown.toHTML( "Hello *World*!" ));

async.waterfall([
    function (cb) {
        gitlab.groups.listProjects(203,(projects) => {
            cb(null,projects)
        });
    },
    function (projects,cb) {
        var combine = [];
        projects.forEach(p => {
            var aa = {projectId:p.id,projectName:p.description};
            combine.push(aa);
        });
        cb(null,combine);
    },
    function (combine,cb) {
        var i=0;
        combine.forEach(combo => {

            gitlab.projects.issues.list(combo.projectId,function (issues) {
                i++;
                console.log(i+"."+combo.projectName+"\r\n");
                issues.forEach(issue =>{
                    var need = '';
                    var improve = '';
                    issue.labels = issue.labels.length == 0? ['其他']:issue.labels;
                    issue.labels.forEach(label => {
                        if(label.startsWith('待')){
                            improve+=label+" ";
                        } else {
                            need+=label+" ";
                        }

                    })
                    console.log(check(issue.state)+issue.assignee.name+strong(need)+"issue#"+issue.iid+ ":"+issue.title+strong(improve));
                })
            })
        })
    }
]);
var check = function(status){
    if (status ==='closed'){
        return '* [x] ';
    } else {
        return '* [ ] ';
    }
}
var strong = function (content) {
    if(content !==''){
        return ` **${content.trim()}** `;
    } else {
        return '';
    }
}


