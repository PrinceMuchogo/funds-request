import prisma from "@/utils/dbconfig";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const claimData = {
      activity: data.activity,
      advanceAmount: data.totalAmount,
      from: new Date(data.from).toISOString(),
      to: new Date(data.to).toISOString(),
      status: "PENDING CHECKER",
      station: data.station,
      venue: data.venue,
      userId: data.userId,
      acquittalStatus: "NOT SET"
    };

    const expertAllowances = data.expertAllowances;
    const travelExpenses = data.travelExpenses;

    const newClaim = await prisma.claimForm.create({
      data: claimData
    })

    await Promise.all(
      travelExpenses.map(async (travellingAndSubsistence: any) => {
        const travellingAndSubsistenceEntry = await prisma.travellingAndSubsistence.create({
          data: {
            claimId: newClaim.id,
            dateDeparture: new Date(travellingAndSubsistence.dateDeparture).toISOString() ,
            dateArrived: new Date(travellingAndSubsistence.dateArrived).toISOString(),
            day: String(travellingAndSubsistence.day),
            breakfast: travellingAndSubsistence.breakfast,
            lunch: travellingAndSubsistence.lunch,
            dinner: travellingAndSubsistence.dinner,
            fares: travellingAndSubsistence.fares,
            supper: travellingAndSubsistence.supper,
            fromPlace: travellingAndSubsistence.fromPlace,
            toPlace: travellingAndSubsistence.toPlace,
            board: travellingAndSubsistence.board,
            total: (Number(travellingAndSubsistence.total))
          },
        });
      }),
    );
    
    await Promise.all(
      expertAllowances.map(async (expertAllowance: any) => {
        const expertAllowanceEntry = await prisma.expertAndAdministrationAllowance.create({
          data: {
            claimId: newClaim.id,
            designation: expertAllowance.designation,
            activity: expertAllowance.activity,
            day: String(expertAllowance.day),
            allowance: Number(expertAllowance.allowance),
            units: Number(expertAllowance.units),
            rate: Number(expertAllowance.rate),
            total: Number(expertAllowance.units) * Number(expertAllowance.rate)
          },
        });
      }),
    );
    // Return the processed data
    return new Response(
      JSON.stringify({ message: "Claim submitted successfully" }),
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
