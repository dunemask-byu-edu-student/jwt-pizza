# Curiosity Report

#### Automation, Automation, Automation!

For many years IT admins have used scripts to automate tasks like setting up a firewall, deploying a webserver, updating dependencies, and many other tasks. The key idea was to automate what would take a sysadmin 20-30 minutes to setup. Bash scripting is very simple to do, but not all systems are created equal, and each machine still needed to be setup with a base system. But now there is a dependency that needs to be updated, or a patch that needs to be applied to every single server. This requires the IT admin to go to each machine, login, figure out what they need to do on a machine, take notes, and then do the same thing on every single machine. This is not automation, this is manual labor! And we don't like that!

### Why Bash Scripting isn't enough?

If an admin were to try to do this with a bash script, they could, but it would be a very cumbersome process with lots of boilerplate, and potential security vulnerabilities. Using bash scripts, an admin would need to write a script that would push potentially sensitive information to the cloud, or copy the script again to every single machine, and then run on each machine after logging in. If there are discrepencies across machines, those would need to be accounted for. Consider also that if there are multiple environments, one might have to alter the script dramatically to ensure nothing breaks. All of these would need to be considered at the time of writing the script when a potentially critical update is pending.

### Ansible!

Ansible is a client tool that sits on your computer and is able to deploy small programs (called modules) to the remote servers. Each of these modules has multiple tasks like like: "Start a docker container" or "Update a dependency". Ansible uses small configuration files written in YAML which allows for extensibility and reusability as well as removing the need to understand coding. Instead, the admin only needs to understand the order of the steps and what each module is doing. Ansible also allows users to define variables that can be used across multiple tasks. For example, you may want to use a specific domain to configure things. This can be set at the very top and changed wherever necessary and reference using the {{var_name}} syntax. 

These configuration files constitute what is called a "playbook" which can be executed on remote hosts with specific users or login credentials which are stored only on your machine. Each playbook can have multiple plays which each have a specific order to them, when the play should be executed, and on which machines the tasks should be executed.

One may not want to continually copy and paste which machine is which though, so instead, they can define a hosts file that looks like this:

 ```
 [webservers]
 10.37.0.1
 10.37.0.2
 [databases]
 10.95.9.2
 10.78.2.3
 ```

 Taking this even further, you can use Ansible to setup your docker containers. Doing so would allow you to not only have a dockerized system, but also allow you to run the exact same configuration across bare-metal and virtualization. That's a huge step because when running a CI pipeline, you may want to spin up all of your containers, but not have the permissions or resources to do so. By writing a playbook that contains the setup instructions, you could setup the CI environment completely the way it needs to be, and then use the same file to describe your production deployment.

 ## Testing it out
 My homelab consists of the following setup:

| Hostname      | Domain        | IP Address  |
| ------------- | ------------- | ----------- |
| **isis**      | galaxy.local  | 10.52.10.30 |
| **satellite** | galaxy.local  | 10.52.10.31 |
| **shu**       | galaxy.local  | 10.52.10.32 |
| **kuiper**    | storage.local | 10.52.10.10 |
| **charon**    | lb.local      | 10.52.10.20 |
| **hypnos**    | galaxy.local  | 10.52.10.90 |

Each is running Debian Bookworm and updates currently require me manually logging in to each machine. Ansible should help me to automate this! Each node can be categorized into the following groups:
1. Web Servers
2. Storage Nodes
3. Load Balancers

## Setting up the playbook

Initially I composed a playbook to update all of the systems, but then I learned that there are already some preset playbooks for common tasks like system upgrades I used the following playbook to update and upgrade my machines:

```yml
- name: Update and upgrade all machines
  hosts: all_hosts
  become: yes
  tasks:
    - name: Update APT package index
      apt:
        update_cache: yes

    - name: Upgrade all packages
      apt:
        upgrade: dist
        autoremove: yes
```

The playbook uses apt and targets all of the hosts. I chose to do everything at once as my system is not 100% uptime critical, but I was wary that there was a chance my system would go down. Next I ensured that all of my machines were properly connected by running: `ansible all -i hosts.ini -m ping`. I noticed that it couldn't find any of the machines. After about a minute of scratching my head I realized that I was doubly connected to the BYU vpn and my homelab network which was causing issues. I ran the command a second time and voila!

## Executing the update

The moment of truth came when I actually ran the machine. I made sure that I had time to troubleshoot anything going wrong and then ran the command `ansible-playbook -i hosts.ini update-upgrade.yml` which kicked off my playbook. Immediately, I ran into an issue because I needed to provide a "become" password. After tacking that option onto the end of my command `ansible-playbook -i hosts.ini update-upgrade.yml --ask-become-pass` At first nothing seemed to happen and then it prompted me for a password. After putting in my password the upgrade ensued and I found myself waiting about 15 minutes for everything to complete. Everything returned normal, and after a quick test by loading up my uncached webserver I felt confident that the upgrade had successfully completed.

## Conclusion

I could have put in the time and effort into setting up everything that ansible did but it would've taken me a few hours, and wouldn't have been as extensible. One of the biggest reasons to use something like ansible is to keep your systems hardened, up to date, or apply a specific patch. Because my machines aren't processing critical data, and because it's a pain to log into each machine to update it, I actually haven't kept them that up to date. This could be a huge security risk if I'm not careful. I'm grateful to now know about ansible to keep my systems up to date without the pain of logging into each machine. Ansible is great!


