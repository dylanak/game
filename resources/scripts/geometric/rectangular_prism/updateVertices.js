var mults = [ ];
var halfdims = [ properties[0] / 2, properties[1] / 2, properties[2] / 2 ];
for(var side = 0; side < 6; side++)
{
	mults[0] = side % 2 * 2 - 1;
	mults[1] = Math.floor(side / 2) * 2 - 1;
	for(var i = 0; i < 4; i++)
	{
		mults[3] = Math.floor(i / 2) * 2 - 1;
		mults[2] = i % 3 == 0 ? -1 : 1;
		vertex(side * 4 + i,
		[
			(side < 4 ? side % 2 == 0 ? -mults[1] * mults[2] : -mults[1] : mults[2]) * halfdims[0],
			(side < 4 ? -mults[3] : -mults[0]) * halfdims[1],
			(side > 3 ? -mults[3] * mults[0] : side % 2 == 0 ? -mults[1] : mults[2] * mults[1]) * halfdims[2]
		],
		[
			mults[2] / 2 + .5,
			mults[3] / 2 +.5
		],
		[
			side < 4 && side % 2 == 1 ? -mults[1] : 0,
			side > 3 ? -mults[0] : 0,
			side < 4 && side % 2 == 0 ? mults[1] : 0
		]);
	}
}
return false;
