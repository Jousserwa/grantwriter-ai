import prisma from "../src/lib/prisma";

async function main() {
  const grants = [
    {
      title: 'Clean Energy Innovation Grant',
      funder: 'U.S. Department of Energy',
      amount: '$500,000 - $2,000,000',
      region: 'United States',
      deadline: new Date('2024-10-15'),
      sector: 'Energy',
      description: 'Funding for innovative clean energy solutions.'
    },
    {
      title: 'Sustainable Agriculture Initiative',
      funder: 'World Bank',
      amount: '$1,000,000',
      region: 'Global',
      deadline: new Date('2024-11-30'),
      sector: 'Agriculture',
      description: 'Improving agricultural sustainability in developing regions.'
    },
    {
      title: 'Horizon Europe Cluster 5',
      funder: 'European Commission',
      amount: '€2,000,000 - €5,000,000',
      region: 'Europe',
      deadline: new Date('2024-09-15'),
      sector: 'Climate',
      description: 'Climate research and innovation.'
    }
  ];

  for (const grant of grants) {
    await prisma.grant.create({
      data: grant,
    });
  }

  console.log('Seed successful');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
