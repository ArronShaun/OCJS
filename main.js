/** A Console Based on Javascript
*** Author: Chao Xiang
*** Update Date: April 15, 2014
*** Team: Dragon Warrior
***/


var io= document.getElementById('io');
var cmd='';
var last='';
var title="localhost#bruce:\n";
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
	helpDoc+='\n'+name;
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
	io.value+='\nINSTRUCTION:\n This command line console implement linux interface, with cjs installed.'
+'\nsupporting commands like: clear (clear screen)\n frontcolor #000 (change front color to black)\n'
+' backcolor #fff (change backcolor to white)\n exit (close console);\ninstalled applications are:'+helpDoc;
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
			editor.style.color='#37F';
			editor.style.backgroundColor='#FFF';
			editor.style.width='100%';
			editor.style.height='50%';
			editor.style.fontFamily='Consolas';
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
	io.value = title;
	now=last = title;
	if(navigator.userAgent.toLowerCase().match(/msie/)){
		var textRange=io.createTextRange();
		textRange.moveStart('character',now.length);
		textRange.collapse(true);
		textRange.select();		
	}
}

//create a new interactive line
function newLine(){
	io.value += "\n" + title.substring(0,title.length-1);
	now = last = io.value+'\n';
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












