function keyArrayItem(a,e,d,b,f,c){this.key=a;this.evalfunc=e;this.field=d;this.auxKey=b;this.propagateKey=f;this.eventShotter=c;}function getShortcuts(d){if(d==null||d==""||d=="null"){}else{if(d=="applicationCommonKeys"){if(!isWindowInMDIContext){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("M","executeMenuButton('buttonExpand');executeMenuButton('buttonCollapse');",null,"ctrlKey+shiftKey",false,"onkeydown"),new keyArrayItem("U","executeMenuButton('buttonUserOptions');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("Q","executeMenuButton('buttonQuit');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("F8","executeMenuButton('buttonAlerts');",null,null,false,"onkeydown"),new keyArrayItem("F9","menuShowHide();",null,null,false,"onkeydown"),new keyArrayItem("I","executeWindowButton('buttonAbout');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("H","executeWindowButton('buttonHelp');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("R","executeWindowButton('buttonRefresh');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("BACKSPACE","executeWindowButton('buttonBack');",null,"ctrlKey+shiftKey",false,"onkeydown"));
}else{var a=getFrame("LayoutMDI");if(typeof a.OB.Layout.ClassicOBCompatibility.Keyboard==="object"&&typeof a.OB.Layout.ClassicOBCompatibility.Keyboard.getMDIKS==="function"){var b=a.OB.Layout.ClassicOBCompatibility.Keyboard.getMDIKS();for(var c=0;c<b.length;c++){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem(b[c].key,[b[c].action,b[c].funcParam],null,b[c].auxKey,false,"onkeydown"));
}}}}else{if(d=="menuSpecificKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("M","putFocusOnWindow();",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("TAB","menuTabKey(true);",null,null,false,"onkeydown"),new keyArrayItem("TAB","menuTabKey(false);",null,null,false,"onkeyup"),new keyArrayItem("TAB","menuShiftTabKey(true);",null,"shiftKey",false,"onkeydown"),new keyArrayItem("TAB","menuShiftTabKey(false);",null,"shiftKey",false,"onkeyup"),new keyArrayItem("ENTER","menuEnterKey();",null,null,false,"onkeydown"),new keyArrayItem("UPARROW","menuUpKey(true);",null,null,false,"onkeydown"),new keyArrayItem("RIGHTARROW","menuRightKey();",null,null,false,"onkeydown"),new keyArrayItem("DOWNARROW","menuDownKey(true);",null,null,false,"onkeydown"),new keyArrayItem("LEFTARROW","menuLeftKey();",null,null,false,"onkeydown"),new keyArrayItem("HOME","menuHomeKey();",null,null,false,"onkeydown"),new keyArrayItem("END","menuEndKey();",null,null,false,"onkeydown"),new keyArrayItem("UPARROW","menuUpKey(false);",null,null,null,"onkeyup"),new keyArrayItem("DOWNARROW","menuDownKey(false);",null,null,null,"onkeyup"));
}else{if(d=="windowCommonKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("M","putFocusOnMenu();",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("F10","swichSelectedArea();",null,null,false,"onkeydown"),new keyArrayItem("N","executeWindowButton('linkButtonNew',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("N","executeWindowButton('linkButtonSave_Next',true);",null,"ctrlKey+shiftKey",false,"onkeydown"),new keyArrayItem("G","executeWindowButton('linkButtonSave_Relation',true);",null,"ctrlKey+shiftKey",false,"onkeydown"),new keyArrayItem("S","executeWindowButton('linkButtonSave',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("S","executeWindowButton('linkButtonSave_New',true);",null,"ctrlKey+shiftKey",false,"onkeydown"),new keyArrayItem("D","executeWindowButton('linkButtonDelete');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("Z","executeWindowButton('linkButtonUndo');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("A","executeWindowButton('linkButtonAttachment');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("F","executeWindowButton('linkButtonSearch');executeWindowButton('linkButtonSearchFiltered');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("HOME","executeWindowButton('linkButtonFirst',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("END","executeWindowButton('linkButtonLast',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("LEFTARROW","executeWindowButton('linkButtonPrevious',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("RIGHTARROW","executeWindowButton('linkButtonNext',true);",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("L","executeWindowButton('linkButtonRelatedInfo');",null,"ctrlKey",false,"onkeydown"));
}else{if(d=="editionSpecificKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("TAB","windowTabKey(true);",null,null,false,"onkeydown"),new keyArrayItem("TAB","windowTabKey(false);",null,null,false,"onkeyup"),new keyArrayItem("TAB","windowShiftTabKey(true);",null,"shiftKey",false,"onkeydown"),new keyArrayItem("TAB","windowShiftTabKey(false);",null,"shiftKey",false,"onkeyup"),new keyArrayItem("ENTER","windowCtrlShiftEnterKey();",null,"ctrlKey+shiftKey",false,"onkeydown"),new keyArrayItem("ENTER","windowCtrlEnterKey();",null,"ctrlKey",true,"onkeydown"),new keyArrayItem("ENTER","windowEnterKey();",null,null,true,"onkeydown"),new keyArrayItem("G","executeWindowButton('buttonRelation');",null,"ctrlKey",false,"onkeydown"));
}else{if(d=="relationSpecificKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("TAB","windowTabKey(true);",null,null,false,"onkeydown"),new keyArrayItem("TAB","windowTabKey(false);",null,null,false,"onkeyup"),new keyArrayItem("TAB","windowShiftTabKey(true);",null,"shiftKey",false,"onkeydown"),new keyArrayItem("TAB","windowShiftTabKey(false);",null,"shiftKey",false,"onkeyup"),new keyArrayItem("G","executeWindowButton('buttonEdition');",null,"ctrlKey",false,"onkeydown"),new keyArrayItem("DELETE","executeWindowButton('linkButtonDelete');",null,null,false,"onkeydown"),new keyArrayItem("ENTER","windowEnterKey();",null,null,true,"onkeydown"));
}else{if(d=="gridKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("UPARROW","windowUpKey();",null,null,true,"onkeydown"),new keyArrayItem("RIGHTARROW","windowRightKey();",null,null,true,"onkeydown"),new keyArrayItem("DOWNARROW","windowDownKey();",null,null,true,"onkeydown"),new keyArrayItem("LEFTARROW","windowLeftKey();",null,null,true,"onkeydown"),new keyArrayItem("HOME","windowHomeKey();",null,null,true,"onkeydown"),new keyArrayItem("END","windowEndKey();",null,null,true,"onkeydown"),new keyArrayItem("REPAGE","windowRepageKey();",null,null,true,"onkeydown"),new keyArrayItem("AVPAGE","windowAvpageKey();",null,null,true,"onkeydown"));
}else{if(d=="genericTreeKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("UPARROW","windowUpKey();",null,null,true,"onkeydown"),new keyArrayItem("RIGHTARROW","windowRightKey();",null,null,true,"onkeydown"),new keyArrayItem("DOWNARROW","windowDownKey();",null,null,true,"onkeydown"),new keyArrayItem("LEFTARROW","windowLeftKey();",null,null,true,"onkeydown"),new keyArrayItem("SPACE","windowSpaceKey();",null,null,true,"onkeydown"));
}else{if(d=="popupSpecificKeys"){this.keyArray.splice(keyArray.length-1,0,new keyArrayItem("ESCAPE","closePage();",null,null,false,"onkeydown"),new keyArrayItem("ENTER","xx();",null,"shiftKey",false,"onkeydown"));}}}}}}}}}}