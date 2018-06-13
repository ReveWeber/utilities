# Put in .bashrc or .bash_profile as appropriate

# credits and resources for your own personalization:
# https://coderwall.com/p/fasnya/add-git-branch-name-to-bash-prompt
# https://ss64.com/bash/syntax-prompt.html
# https://misc.flogisoft.com/bash/tip_colors_and_formatting

# retrieve git branch for prompt, returns it in parens
parse_git_branch() {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

# set command prompt to end of pwd with slash; git branch if any;
# current time in brackets and grayed out; $ usually but # if root
export PS1='\W/$(parse_git_branch) \[\033[90m\][\@]\[\033[00m\]\$ '
