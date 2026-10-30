
%{
#include <stdio.h>
%}

%option noyywrap
%option yylineno

%%

"int"|"float"|"char"|"if"|"else"|"while"|"for"|"return"|"void"|"double" {
    printf("%s\t%s\t%d\n", yytext, "KEYWORD", yylineno);
}

[a-zA-Z_][a-zA-Z0-9_]* {
    printf("%s\t%s\t%d\n", yytext, "IDENTIFIER", yylineno);
}

[0-9]+(\.[0-9]+)? {
    printf("%s\t%s\t%d\n", yytext, "NUMBER", yylineno);
}

"=="|"!="|"<="|">="|"<"|">" {
    printf("%s\t%s\t%d\n", yytext, "OPERATOR", yylineno);
}

"+"|"-"|"*"|"/"|"="|"%" {
    printf("%s\t%s\t%d\n", yytext, "OPERATOR", yylineno);
}

";"|"("|")"|"{"|"}"|"["|"]"|"," {
    printf("%s\t%s\t%d\n", yytext, "SPECIAL SYMBOL", yylineno);
}

[ \t\r\n]+ {
    /* Ignore whitespace */
}

. {
    printf("%s\t%s\t%d\n", yytext, "INVALID TOKEN", yylineno);
}

%%

int main() {
    yylex();
    return 0;
}
