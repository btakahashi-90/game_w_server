function MobsList({mob}){
    return(
        <>
            <div>{mob.name}</div>
            <div>{mob.hp}</div>
            <div>{mob.damage}</div>
            <div>{mob.damage_mod}</div>
            <div>{mob.damage_reduction}</div>
        </>
    )
}

export default MobsList