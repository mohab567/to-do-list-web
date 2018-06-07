
var http = require('http');
var fs =  require('fs');
var mo = require("express");
var path = require ("path");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var app = mo();
app.use(bodyParser.json());

app.use(mo.static('public'));
app.get('/', function(req, res) {


        res.sendFile(path.join(__dirname + "/" +"public/"+ "home.html"));

    });

var index,userEmail;
app.post('/taskssignin',urlencodedParser,function (req,res) {
    console.log("entered");
    var email = req.body.email;
    var passord = req.body.passwordlogin;
    var flag =0;
    fs.readFile(__dirname + '/' + 'users.json' , function(err,data) {
        data = JSON.parse(data);

        var i=0;
        for (var temp in data){
          //  console.log(JSON.stringify(data));
            console.log(data[temp].pass + " ==" + passord);
           // console.log(temp.email + " ==" + email);
            if(data[temp].pass == passord && data[temp].email == email) {

                console.log("found");
                console.log(passord);
                flag =1;
                user =temp;



              res.sendFile(path.join(__dirname + "/" +"public/"+ "to-do-list.html"));
                break;
            }

temp++;
        }
      if (flag == 0) {
          console.log("email not found");
          res.sendFile(path.join(__dirname + "/" +"public/"+ "homeL.html"));

      }

    });




});
app.post('/getdata',urlencodedParser,function (req,res) {
    fs.readFile(__dirname + '/' + 'users.json' , function(err,data) {
        data=JSON.parse(data);

        res.send(data[user]);



    })
});
app.post('/sdata',urlencodedParser,function (req,res) {
    fs.readFile(__dirname + '/' + 'users.json' , function(err,data) {
        data=JSON.parse(data);
        data[user]=req.body.data;
        fs.writeFile(__dirname + "/" + "users.json" , JSON.stringify(data),function(err,data){
           // console.log(JSON.stringify(data));
        });

        res.send("ok");


    })
});
app.post('/tasksregister',urlencodedParser,function (req,res) {
    function task(name,date,disc,mark){

        this.name = name;
        this.date = date;
        this.disc=disc;
        this.mark=mark;

    }
    var dummy=new task("dumm","","dum","6");
    var name = req.body.namereg;
    var email = req.body.emailreg;
    var password = req.body.passreg;

    var add ={};
        add.name = name;
        add.pass = password;
        add.email = email;
       add.tasks = [];
    add.tasks.push(dummy);



    fs.readFile(__dirname + '/' + 'users.json' , function(err,data) {
        var flag = 0;
        data = JSON.parse(data);
        var k = 0;

        for (var i in data) {

            if(data[i].email == email) {

                console.log("email exisits");
                flag = 1;
                res.sendFile(path.join(__dirname + "/" +"public/"+ "homeR.html"));
                break;

            }
            k++;
        }
        if (flag == 0) {
            fs.readFile(__dirname + '/' + 'users.json' , function(err,data) {

                data = JSON.parse(data);
                data[k]= add;
                user=k;

                fs.writeFile(__dirname + "/" + "users.json" , JSON.stringify(data),function(err,data){
                    //console.log(JSON.stringify(data));
                });

            });
           // res.sendFile(path.join(__dirname + "/" +"public/"+ "to-do-list.html"));

        }

    });


});

app.get('*',function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write("error page not found");
    console.log("not found");
    res.end();
});

var server = app.listen(8888, function () {
    var user = 0 ;
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

