# `sshx` for switching rsa creds  `BETA`


**`sshx`** helps you switch between rsa credentials:


## Installation

### `Linux`

Python3.x:

    sudo cp sshx /bin/sshx
    sudo chmod +x /bin/sshx    

### `macOS`

Python3.x:

    sudo cp sshx /usr/local/bin/sshx
    sudo chmod +x /usr/local/bin/sshx

## Notes

- `--list`/`-l` : Listing your credentials

    ```zsh
    ❯ sshx
      rsa01
      rsa04
    * rsa02
    ```
    or
    ```zsh
    ❯ sshx -l
      rsa01
      rsa03
    * rsa02
    ```


- `--help`/`-h` : Showing help menu

    ```zsh
    ❯ sshx --help
    usage: sshx [-h] [-a ADD] [-r REMOVE] [-l] [-p ADD_PROMPT] [-mfa UPDATE_MFA]
                [change]

    positional arguments:
    change                Example: sshx foo , sshx bar

    optional arguments:
    -h, --help            show this help message and exit
    -a ADD, --add ADD     add your credentials to sshx
    -r REMOVE, --remove REMOVE
                            remove your credentials from sshx
    -l, --list            list your credentials from sshx
    -p ADD_PROMPT, --add-prompt ADD_PROMPT
                            you can create creds from prompt


    ```

- `--add`/`-a` : Copying your .ssh/* files to .ssh.configs/ directory with given name.

    ```zsh
    ❯ sshx -a rsa04
    Stored 'rsa04' credentials succesfully
    ```

- `--add-prompt`/`-p` : Creating credentials files from prompt.

    ```zsh
    ❯ sshx -p rsa01
    Please enter public rsa key:
    Please enter private rsa key:
    Stored 'rsa01' credentials succesfully

    ```

- `change`: Change current credentials

    ```zsh
    ❯ sshx rsa02
    Credentials changed to 'rsa02'

- `--remove`/`-r` : Removing your credentials from .ssh.configs/ directory

    ```zsh
    ❯ sshx -r rsa03
    Removed 'rsa03' credentials successfully
    ```


