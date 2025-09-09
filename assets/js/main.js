window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

function registrarVenda(){
  const valor = parseFloat(document.getElementById('valorVenda')?.value || '0');
  const codigo = (document.getElementById('codigoVendedor')?.value || '').trim();
  const cross = document.getElementById('crossSell')?.checked;
  if(!valor || !codigo){ alert('Preencha os campos.'); return; }
  const base = Math.round(valor / 10); // 1 ponto a cada R$10 (exemplo)
  const pontos = cross ? base * 2 : base;
  alert(`Venda registrada. Pontos: +${pontos}${cross ? ' (2× cross-sell)' : ''}`);
  const m = document.getElementById('registrarVendaModal');
  if (m) bootstrap.Modal.getInstance(m)?.hide();
}

function resolverDisputa(){
  const decisao = document.getElementById('decisaoDisputa')?.value;
  const codigo = (document.getElementById('codigoGerente')?.value || '').trim();
  if(!codigo){ alert('Informe o código de validação.'); return; }
  alert(`Disputa marcada como: ${decisao}. Código: ${codigo}`);
  const m = document.getElementById('resolverDisputaModal');
  if (m) bootstrap.Modal.getInstance(m)?.hide();
}
