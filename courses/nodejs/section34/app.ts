

//(34.0.1)
/*
let message: string;

message = "Hi there!";

console.log(message);
*/

/*

//(34.0.4)

//repeating the same code with node







*/


//(34.0.2)
const text = "this is a test - and it should be stored in a file!";

//a globally available feature in deno
//helps convert text to bytes
const encoder = new TextEncoder();
const data = encoder.encode(text);

//path/filename, data to be written byte array
//as deno supports modern js, we can use a promise on writeFile instead of a callback
Deno.writeFile("message.txt", data)
.then(() => {
    console.log("wrote to file");
})
.catch(() => {

})





























/*
///////////////////////////////////////////////////////////////////
//Deno introduction

an alternative to node
created by the inventor of node
still written with js, but there are differences

how it is similar to node ?
how to transfer node knowledge to deno ?
is there an advantage to using deno over normal node ?


DENO;
a javascript runtime based on Chrome's V8 js engine (just like node)
allows to run javascript outside of the browser (just like node)

1) but not just a js runtime, but js and ts runtime
can execute uncompiled ts code, it has a build in TS compiler

but node executable is only able to execute js code
TS code needs to be compiled to js code on node apps

2) Deno supports URL imports out of the box
and modern js features are embraced (e.g Promises)

url imports are different from how you manage dependencies in node projects

3) Deno is "secure by default" and requires
explicit execution permissions


////Why Deno ?
Deno is an attempt to make node better

Deno, 
JS + Typescript support
modern JS features
URL imports
script permissions

Node.js
only JS support
modern JS features [missing]
custom module system
np script permissions
= but it is established, has active ecosystem, used by thousands of big companies
= has a huge base of maintainers and is production-proven

but you might not need all Deno enhancements

///////////////////////////////////////////////////////////////////
//Deno setup

go to url "deno.land"

will find all possible ways of installing deno

for mac will use Using Shell (macOS and Linux):
>> # curl -fsSL https://deno.land/x/install/install.sh | sh

this will download/install deno
Deno was installed successfully to /Users/sheriffkoder/.deno/bin/deno


>> Manually add the directory to your $HOME/.zshrc (or similar)
export DENO_INSTALL="/Users/sheriffkoder/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

> can view hidden files on mac by
CMD + SHIFT + .

> if do not have the file, can create it yourself

>> close the terminal/console
>> run # Deno, will get you to the interactive mode


" on windows just paste the command in powershell then run 'deno' "


///////////////////////////////////////////////////////////////////
//(34.0.1)
//Deno use

>> create a new folder
>> create file "app.ts"


>> # deno run app.ts
if ran the same code again
will find out it will skip compiling
because it caches compiled code
and will reuse the already compiled code


now we will discover if deno has core-modules like node
like the fs, path etc.
and promise based api versions available for some of these core-modules

however with deno there is something similar
called the namespace API
 
these can be called on a deno object
Deno.moduleName

the "fetch" is available here but not available in node
for sending http requests

the core philosophy for deno is to be as compatible as possible
that means that any code that could run out of the browser
is also supported in deno

can think of the type of these APIs as:
(what you can do in the browser)
- 
(features that only make sense in the browser)
+ 
(features that can't be used inside of the browser e.g writeFile)


///////////////////////////////////////////////////////////////////
//(34.0.2)
//using the runtime api


want to store some text in a file

trying to access an api 
Deno.
is not understood by the IDE

to fix that**
go to view > extensions > search for Deno > install+enable
this will bring deno support for vscode
switch back to view > explorer


>> use the TextEncoder deno constructor object 
to convert the strings to bytes

>> use the writeFile deno API that takes outputFile, byteDate

>> use a .then to confirm the process



///////////////////////////////////////////////////////////////////
//(34.0.3)

//Deno's security model

on running the code
the console will ask to give permission to write a file
this is a key feature in deno

when we write a script with deno
this script does not have all possible permissions
read/write files, sending/listening to network requests

why? because for example on node
your code can do anything, can also delete all file on your system
and nothing can stop it from doing that

and sometimes you do not want a file to do certain things

thus, you have to trust the code
have to set the appropriate permissions
by setting some security specific flags

change the running code form
# deno run app.ts
to
# deno run --allow-write app.ts

--allow-write   (write to any file)
--allow-read
--allow-write=message.txt,message2.txt (write to these files only)















*/


