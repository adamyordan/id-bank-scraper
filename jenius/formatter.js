function formatSingle(raw) {
  return {
    id: raw.id,
    amount: raw.amount,
    note: raw.note,
    debitCredit: raw.debitCredit,
    createdAt: raw.createdAt,
    partnerName: raw.partner.name,
    partnerAccount: raw.partner.account,
    partnerOrg: raw.partner.org,
  }
}

async function format(raw) {
  const data = raw.data.viewer.accounts[0].transactions.items
  return data.map(r => formatSingle(r))
}

module.exports = { format }
