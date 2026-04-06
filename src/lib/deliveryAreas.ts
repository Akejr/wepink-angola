export interface DeliveryArea {
  name: string;
  fee: number;
}

export const deliveryAreas: DeliveryArea[] = [
  { name: "Benfica", fee: 2500 },
  { name: "Cacuaco", fee: 5000 },
  { name: "Calemba 2", fee: 3000 },
  { name: "Camama", fee: 2500 },
  { name: "Cassequel", fee: 2500 },
  { name: "Cidade", fee: 2000 },
  { name: "Escongolenses", fee: 2500 },
  { name: "Futungo", fee: 2000 },
  { name: "Gamek", fee: 2000 },
  { name: "Golf 2", fee: 2000 },
  { name: "Kilamba", fee: 3500 },
  { name: "Morro Bento", fee: 2000 },
  { name: "Nova Vida", fee: 2500 },
  { name: "Palanca", fee: 2500 },
  { name: "Patriota", fee: 2500 },
  { name: "Prenda", fee: 2500 },
  { name: "Rocha Pinto", fee: 2000 },
  { name: "Samba", fee: 2000 },
  { name: "Sequele", fee: 5500 },
  { name: "Talatona", fee: 2500 },
  { name: "Viana", fee: 3500 },
  { name: "Zango 0", fee: 4000 },
  { name: "Zango", fee: 5500 },
];

export function getDeliveryFee(areaName: string): number {
  const area = deliveryAreas.find((a) => a.name === areaName);
  return area?.fee ?? 2500;
}
