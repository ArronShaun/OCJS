/** A Console Based on Javascript
*** Author: Chao Xiang
*** Update Date: April 15, 2014
*** Team: Dragon Warrior
***/


var io= document.getElementById('io');
var cmd='';
var last='';
var title="****************** SMARTJS ******************";
var now=title;
var files=[];


/** register components begin **/
var com=[];
var tool=[];
var comName=[];
var comHandler=[];
var helpDoc='';
var state='normal';
var filename='untitled';

// global function that would be used in custom designed components
function println(words){
	io.value+='\n'+words;
}

function print(words){
	io.value+=words;
}

com.add=function(name,handler){
	// we need to check if components have contradictory
	var n=comName.length;
	var flag=false;
	for(var i=0;i<n;i++){
		if(comName[i]==name){
			flag=true;
		}
	}
	if(flag){
		println('Components contradictory found when installing component ['+name+']');
		println('Two components are named the same, this is not allowed! Installing process failed!');
		return;
	}
	
	comName.push(name);
	helpDoc += name + "    ";
	comHandler.push(handler);		
};

//tools of functions
tool.add=function(name,handler){
	if(typeof tool[name]=='undefined'){
		tool[name]=handler;
	}
	else{
		println('tools contradictory found when installing tool ['+name+']');
		println('Two tools are named the same, this is not allowed! Installing process failed!');
		return;
	}
};

/** register components end **/



/** user definition of components begin **/

com.add('clear',function(arg){
	io.value='';
});

com.add('help',function(arg){
	io.value+='\nINSTRUCTION:\n This command line console implement linux interface and much more interactive methods'
+'\nsupporting commands :\n'+helpDoc;
});

com.add('exit',function(arg){
	io.value+='\nThe console is exiting...'
	this.window.close();
});

com.add('frontcolor',function(arg){
	io.style.color=arg[1];
});

com.add('backcolor',function(arg){
	io.style.backgroundColor=arg[1];
});

// create file in memory
com.add('create',function(arg){
	if(arg.length<2){
		io.value+='\nyou should type a file name to make a text file, like: create test.cjs';
	}
	else{
		var fn=arg[1];
		files.push(fn);
		files[fn]='';
		io.value+='\nfile ['+fn+'] is created! wanna edit it? type in : edit '+fn;
	}
});

// edit file
com.add('edit',function(arg){
	if(arg.length<2){
		io.value+='\nyou should type a file name to edit a text file, like: edit test.cjs';
	}
	else{
		if(state=='edit'){
			io.value+="\nCommand cannot be completed! A editor is on with another file! Try to save it before you edit new file!";
			return;
		}
		var fn=arg[1];
		var editor=document.getElementById('editor');

		if(editor==null){
			editor=document.createElement('textarea');
			editor.id='editor';
			editor.style.color='#FFFFFF';
			editor.style.backgroundColor='#38A';
			editor.style.width='100%';
			editor.style.height='50%';
			editor.style.fontFamily='Consolas';
			editor.style.fontSize = "1em";
			editor.style.fontWeight='normal';
			document.body.appendChild(editor);
		}
		
		editor.style.display='block';
		editor.style.position='fixed';
		editor.style.top='50%';
		io.style.height='50%';
		editor.value=files[fn];
		state='edit';
		filename=fn;
	}
});

// save editing file
com.add('save',function(arg){
	if(state!="edit"){
		io.value+='\nNo File needed to save!';
		return;
	}
	var editor=document.getElementById('editor');
	if(arg.length==1){
		files[filename]=editor.value;
		io.value+='\nFile Saved As '+filename+'!';
	}
	else {
		files[arg[1]]=editor.value;				
		io.value+='\nFile ['+arg[1]+'] is saved!';
	}
});

com.add('save&exit',function(arg){
	if(state!="edit"){
		io.value+='\nEditor is not on!';
		return;
	}
	var editor=document.getElementById('editor');
	if(arg.length==1){
		files[filename]=editor.value;
		io.value+='\nFile Saved As '+filename+'!';
	}
	else {
		files[arg[1]]=editor.value;				
		io.value+='\nFile Saved As '+filename+'!';
	}
	editor.style.display='none';
	io.style.height='100%';
	io.value+='\nEditor closed!';
	state='normal';
});

// close editor but not to save it
com.add('drop&exit', function(){
	if(state!="edit"){
		io.value+='\nEditor is not on!';
		return;
	}
	var editor=document.getElementById('editor');
	io.value+='\nEditing content is discarded!';
	editor.style.display='none';
	io.style.height='100%';
	io.value+='\nEditor closed!';
	state='normal';
});


// cjs compiler
tool.add('compile',function(codes){
	var ErrorLevel=0;
	
	return ErrorLevel;
});

com.add('cjs',function(arg){
	if(arg.length<2){
		io.value+='\n You are expected to enter a filename or check version argument after this command! like:[ cjs -v ] or [ cjs test.cjs ]';
		return;	
	}
	if(arg[1]=='-v'){
		io.value+='\n application [cjs] version control: 1.0';
	}
	else{
		io.value+='\nRunning Program...';
		var pg=files[arg[1]];
		if(typeof pg=='undefined'){
			println('file ['+arg[1]+'] not found! \nprogram terminated.');
			return;
		}
		println('program codes are:'+pg);
		var error=compile(pg);
		if(error==0){
			println('program compiling successful!');
		}
		else{
			println('failure found when attempting to compile codes...');
			println('Error Level: '+error);
		}
	}
});

com.add('echo', function(str){
    if(str.length<2){
        println("Requires A Argument!");
        return;
    }
    // join with others
    var words = '';
    for(var i=1;i<str.length;i++){
        words += str[i]+' ';
    }
    println(words);
});

com.add('cat', function(str){
    if(str.length<2){
        println("A file name is required!");
        return;
    }
    for(var i=1;i<str.length;i++){
        if(typeof files[str[i]]!="undefined"){
            println("FILE["+str[i]+"]:\n"+files[str[i]]);
        }
        else{
            println("FILE["+str[i]+"]:\n"+"NOT FOUND!");
        }
    }
});


com.add('imshow', function(arg){
	if(arg.length<2){
		println("Image File URL Required!");
	}
	
	var n = arg.length;
	for(var i=1;i<n;i++){
		display.innerHTML += "<img src="
			+ "'"
			+ arg[i]
			+ "'"
			+ " style='max-width:"
			+ 100.0/(n-1)
			+ "%;'"
			+ " />";
	}
});

com.add('clc', function(args){
	println("Canvas Clear!");
	display.innerHTML = '';
});

com.add('print', function(args){
	if(args.length<2){
		println("Text to Draw Required!");
	}
	var words = '';
    for(var i=1;i<args.length;i++){
        words += args[i]+' ';
    }
	display.innerHTML += "<p>" + words + "</p>";
});

com.add("bar", function(args){
	if(args.length<6){
		var tips = "Demo:\n bar "
		+ "#00ca00[color] "
		+ "10[x] 20[y] "
		+ "100%[width] 30[height] "
		+ "Product Line Cost[Bar Label]";
		println(tips);
	}
	
	// join with args as label
	var label = "";
	var n = args.length;
	if(args.length>6){
		for(var i=6;i<n;i++){
			label += args[i]+" ";
		}
	}
	
	// draw bar using description
	display.innerHTML += "<div "
		+ "style='position:relative;"
		+ "color:#ffffff;"
		+ "font-weight:bold;"
		+ "background-color:" + args[1] + ";"
		+ "margin-left:" + args[2] + ";"
		+ "margin-top:" + args[3] + ";"
		+ "width:" + args[4] + ";"
		+ "height:" + args[5] + ";"
		+"'>"
		+ label
		+ "</div>";
});

com.add("timer", function(args){
	if(args.length<3){
		println("Demo:\ntimer 3000[delay in ms] echo The Timer worked![handler program to run]");
	}
	// collect timer arguments
	var delay = args[1];
	var n = args.length;
	var handler = "";
	// rejoin the handler command
	handler += args[2];
	if(n>3){
		for(var i=3;i<n;i++){
			handler += " " + args[i];
		}
	}
	// execute the command after the delay
	setTimeout(function(){
		execute(handler);
	}, delay);
});

com.add("ls", function(args){
	// show all the files stored in filelist
	var n = 0;
	if(args.length>1&&args[1]=='-a'){
		for(var fn in files){
			println("Name: "+ fn + "	Bytes: " + files[fn].length);
			n++;
		}
		println("There are " + n +" Files.");
	}
	else if(args.length==1){
		for(var fn in files){
			println(fn);
			n++;
		}
		println("There are " + n +" Files.");
	}
	else{
		println("Demo:\nls -a [Means show all the information of the filelist, this argument is optional]");
	}
});

com.add("run", function(args){
	// running batch code just like LINUX Device
	if(args.length!=2){
		println("Usage:\nrun shell.sh[batch file name]");
		return;
	}
	if(typeof files[args[1]]=="undefined"){
		println("Shell File Not Found!");
		return;
	}
	var shell = files[args[1]];
	var lines = shell.split("\n");
	// How to ensure the code are executed in order? In A Synchronized Way?
	var n = lines.length;
	for(var i=0;i<n;i++){
		execute(lines[i]);
	}
});

/** user definition of components end **/



// write a line
function say(words){
	io.value += title+words+"\n";
}

//print within the current session of interaction 
function print(str)
{
	io.value += str;
}

//clear the screen
function clear(){
	io.value = title + "\n";
	now = last = title;
	if(navigator.userAgent.toLowerCase().match(/msie/)){
		var textRange=io.createTextRange();
		textRange.moveStart('character',now.length);
		textRange.collapse(true);
		textRange.select();		
	}
}

//create a new interactive line
function newLine(){
	io.value += "\n" + title.substring(0,title.length);
	now = last = io.value;
	if(navigator.userAgent.toLowerCase().match(/msie/)){
		var textRange=io.createTextRange();
		textRange.moveStart('character',now.length);
		textRange.collapse(true);
		textRange.select();		
	}
}

// execute a line
function execute(cmd){
	cmd=cmd.replace('\n','');
	var words=cmd.split(' ');
	var len=comName.length;
	for(var i=0;i<len;i++)
	{
		var name=comName[i];
		var handler=comHandler[i];
		if(words[0]==name){
			handler(words);
		}
	}
}

//run command in current line
function run(){
	now=io.value;
	cmd=now.substring(last.length,now.length);
	execute(cmd);
	newLine();
}

io.onkeypress=function(e){
	var evnt=[];
	if(typeof e == "undefined"){
		evnt = window.event;
	}
	else {
		evnt = e;
	}
	if(evnt.keyCode==13){
		run();
	}
}

function initial(){
	// do some pre-process staff
	clear();
}

initial();

