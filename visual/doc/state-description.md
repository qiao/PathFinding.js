From [issue 6](https://github.com/qiao/PathFinding.js/issues/6)

#### states and button labels/actions

##### before searching; no colored squares - state B
- **Start Search** - to N
- **Pause Search** - button disabled (grayed out)

##### starting a new search - state N
This state clears any existing search progress and then immediately goes to state S.

##### during searching - state S
- **Restart Search** - to N
- **Pause Search** - to P

when search has finished - to F

##### search is paused - state P
- **Resume Search** - to S
- **Cancel Search** - to B

##### search has finished - state F
- **Restart Search** - to N
- **Clear Path** - to B

selecting a different algorithm or adding or deleting walls - to M

##### after search has finished and user has changed settings - state M
- **Start Search** - to N
- **Clear Path** - to B
