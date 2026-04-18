import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { plan, isAnnual } = await req.json();

    let price = 0;
    if (plan === "Essencial") price = isAnnual ? 284400 : 29700; // in cents (x100)
    if (plan === "Corporativo PRO") price = isAnnual ? 860400 : 89700;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // Em um cenário real de SaaS seria 'subscription' com Price IDs criados no dashboard. Aqui usamos 'payment' para simular e permitir que a UI passe o preço dinâmico sem configuração extra lá.
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Plano ${plan} - DevJobs.br (${isAnnual ? 'Anual' : 'Mensal'})`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/empresa/premium?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/empresa/premium?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Erro no checkout:", error);
    return NextResponse.json({ message: "Erro interno no Stripe Checkout" }, { status: 500 });
  }
}
