

class MathReward:
    """
    Math reward tiers are defined in this class
    """
    def __init__(self) -> None:
        # 20s to answer
        self.allowed_time = 20
        self.reward_threshold = {
            't1' : 0,
            't2' : 10,
            't3' : 15,
            't4' : 18,
        }


    def get_reward_tier(self, time_left):
        rew = {'t1' : 0, 't2' : 0, 't3' : 0, 't4' : 0}

        if time_left >= self.reward_threshold['t4']:
            rew['t4'] = 1
        elif time_left >= self.reward_threshold['t3']:
            rew['t3'] = 1
        elif time_left >= self.reward_threshold['t2']:
            rew['t2'] = 1
        elif time_left > self.reward_threshold['t1']:
            rew['t1'] = 1
        return rew
