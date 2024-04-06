---
social_image: null
main_image: null
tags: productivity, todayilearned
published_at: 2021-05-07T12:11:36.042Z
---

# Create Bash aliases to work faster

Tired of typing the same long commands over and over? Do you feel inefficient working on the command line? Bash aliases can make a world of difference. 

A bash alias is used to create or overwrite a command which you can use in the terminal.

For example, you can define a command `init` to run `npm init`, or maybe a command `status` to run `git status`. So if you run `init`, `npm init` will be run. You can even configure arguments (my current favourite command is `mkcd <folder>` which creates a folder and cds into it)

Creating bash aliases are easy. There are mainly three methods to do so.

### 1. Do it directly from the terminal

In a terminal, run `alias command_name="command to execute"` (`alias status="git status"`). That's it!

The only downside to this is that the aliases can't take arguments. That brings us to....

### 2. Add it to your `~/.bashrc`

Open the `~/.bashrc` file in any editor and add an alias just like you did before:

```sh
# alias command_name="command to execute"
alias status="git status"
```

And that's it! What's more, you can configure arguments to aliases by using functions! To get the first argument use `"$1"`, and to get the second argument use `"$2"`, etc.

You may need to read more about functions, but the below functions should give you an idea of how it works.

```sh
# mkdir folder and cd folder
# example: mkcd folder
mkcd() {
	mkdir "$1" && cd "$1"
}

# notify me after a long process is over
# example: notify "npm run build"
notify() {
	eval "$1" && say "Done!"
}
```

Once you have saved this file, run `source ~/.bashrc` to make sure the new aliases have been loaded.

#### Optional: Create a new file to hold aliases

You can create a new file like `~/.bash_aliases` and save the aliases in there. Just remember to add the following to your `~/.bashrc`:

```sh
if [ -e $HOME/.bash_aliases ]; then
    source $HOME/.bash_aliases
fi
```

Now, the aliases can be added in the `~/.bash_aliases`.

Once again, run `source ~/.bashrc` to make sure the new aliases have been loaded.