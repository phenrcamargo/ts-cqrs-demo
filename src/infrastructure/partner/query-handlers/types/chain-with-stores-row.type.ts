export type ChainWithStoresRow = {
  chain_id: string;
  chain_companyId: string;
  chain_name: string;
  chain_description: string;
  chain_currency_code: number;
  chain_country_code: number;
  chain_createdAt: Date;
  chain_updatedAt: Date | undefined;
  chain_disabledAt: Date | undefined;

  store_id: string;
  store_chainId: string;
  store_document: string;
  store_documentType: number;
  store_name: string;
  store_description: string;
  store_phone: string;

  store_addressNumber: number;
  store_addressStreet: string;
  store_addressCity: string;
  store_addressState: string;
  store_addressCountry: string;
  store_addressZipcode: string;
  store_addressLatitude: number;
  store_addressLongitude: number;

  store_createdAt: Date;
  store_updatedAt: Date | undefined;
  store_disabledAt: Date | undefined;
};
