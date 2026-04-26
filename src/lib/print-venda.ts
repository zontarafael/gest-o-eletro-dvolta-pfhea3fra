import { supabase } from '@/lib/supabase/client'

export async function printPedidoVenda(vendaId: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=800')
  if (!printWindow) {
    alert('Por favor, permita pop-ups para visualizar a impressão do pedido.')
    return
  }

  printWindow.document.write(
    '<html><head><title>Carregando...</title></head><body style="font-family: sans-serif; padding: 20px;">Gerando documento, por favor aguarde...</body></html>',
  )

  const { data: venda, error } = await supabase
    .from('vendas')
    .select(`
      *,
      clientes (*),
      venda_itens (
        *,
        produtos (*)
      )
    `)
    .eq('id', vendaId)
    .single()

  if (error || !venda) {
    console.error('Error fetching venda for printing', error)
    printWindow.close()
    alert('Erro ao carregar os dados para impressão.')
    return
  }

  const { data: empresa } = await supabase.from('empresa_config').select('*').single()

  let vendedorNome = ''
  if (venda.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', venda.user_id)
      .single()
    if (profile) vendedorNome = profile.name
  }

  const empresaNome = empresa?.razao_social || 'Dvolta Logística Reversa'
  const empresaCnpj = empresa?.cnpj || '16.369.730/0001-02'
  const empresaEndereco =
    empresa?.endereco ||
    'RODOVIA SC 480, S/Nº (KM 94) - LINHA TRÊS PONTES\nXanxerê/SC - CEP: 89820-000'
  const empresaTelefone = empresa?.telefone || '(49) 98405-2610'
  const empresaEmail = empresa?.email || 'dvoltalogistica@gmail.com'
  const site = 'www.dvoltalogistica.com.br'

  const dataVenda = new Date(venda.data_venda || new Date()).toLocaleDateString('pt-BR')
  const cliente = venda.clientes || {}
  const items = venda.venda_itens || []

  const enderecoCompleto = [cliente.rua, cliente.numero, cliente.bairro].filter(Boolean).join(', ')

  let telefonesStr = ''
  if (cliente.telefones && Array.isArray(cliente.telefones) && cliente.telefones.length > 0) {
    telefonesStr = cliente.telefones.join(' / ')
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pedido de Venda - ${venda.codigo}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; color: #000; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
          .header-left { display: flex; gap: 20px; align-items: center; }
          .logo { width: 120px; height: auto; object-fit: contain; }
          .company-info h1 { margin: 0; font-size: 16px; font-weight: bold; }
          .company-info p { margin: 2px 0; font-size: 11px; white-space: pre-line; }
          .header-right { text-align: right; }
          .header-right p { margin: 2px 0; font-size: 11px; font-weight: bold; }
          
          .title-bar { background-color: #e0e0e0; padding: 6px; font-weight: bold; font-size: 14px; text-align: center; border: 1px solid #000; position: relative; margin-bottom: 10px; }
          .title-bar .right-date { position: absolute; right: 10px; top: 6px; font-size: 12px; }
          
          .subtitle-bar { padding: 5px; font-weight: bold; font-size: 12px; border: 1px solid #000; margin-bottom: 10px; background-color: #f9f9f9; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
          th { background-color: #f0f0f0; font-size: 11px; }
          
          .section-title { background-color: #f0f0f0; font-weight: bold; padding: 5px; border: 1px solid #000; border-bottom: none; font-size: 12px; }
          
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          
          .product-desc { font-size: 10px; font-style: italic; margin-top: 8px; color: #111; line-height: 1.4; }

          .termo { font-size: 12px; text-align: justify; margin-top: 20px; border: 1px solid #000; padding: 15px; line-height: 1.5; }
          .termo h3 { text-align: center; font-size: 14px; margin-top: 0; margin-bottom: 15px; font-weight: bold; text-decoration: underline; }
          .termo ul { margin-top: 5px; margin-bottom: 10px; padding-left: 20px; list-style-type: circle; }
          .termo p { margin-bottom: 8px; }
          
          .signature { margin-top: 50px; text-align: center; margin-bottom: 20px; }
          .signature-line { width: 400px; border-top: 1px solid #000; margin: 0 auto; padding-top: 5px; font-size: 12px; }
          
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            ${empresa?.logo_url ? `<img src="${empresa.logo_url}" class="logo" />` : ''}
            <div class="company-info">
              <h1>${empresaNome}</h1>
              <p>CNPJ: ${empresaCnpj}</p>
              <p>${empresaEndereco.replace(/\n/g, '<br/>')}</p>
            </div>
          </div>
          <div class="header-right">
            <p>${empresaTelefone}</p>
            <p>${empresaEmail}</p>
            <p>${site}</p>
            ${vendedorNome ? `<p>Vendedor: ${vendedorNome}</p>` : ''}
          </div>
        </div>
        
        <div class="title-bar">
          PEDIDO Nº ${venda.codigo}
          <span class="right-date">${dataVenda}</span>
        </div>
        
        <div class="subtitle-bar">PRAZO DE ENTREGA: ${dataVenda}</div>
        
        <div class="section-title">DADOS DO CLIENTE</div>
        <table>
          <tr>
            <td style="width: 60%;"><strong>Cliente:</strong> ${cliente.nome || ''}</td>
            <td style="width: 40%;"><strong>CNPJ/CPF:</strong> ${cliente.documento || ''}</td>
          </tr>
          <tr>
            <td><strong>Endereço:</strong> ${enderecoCompleto}</td>
            <td><strong>CEP:</strong> ${cliente.cep || ''}</td>
          </tr>
          <tr>
            <td><strong>Cidade:</strong> ${cliente.cidade || ''}</td>
            <td><strong>Estado:</strong> ${cliente.estado || ''}</td>
          </tr>
          <tr>
            <td><strong>Telefone:</strong> ${telefonesStr}</td>
            <td><strong>E-mail:</strong> ${cliente.email || ''}</td>
          </tr>
        </table>
        
        <div class="section-title">PRODUTOS</div>
        <table>
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">ITEM</th>
              <th style="width: 50%;">NOME</th>
              <th style="width: 10%; text-align: center;">UND.</th>
              <th style="width: 10%; text-align: center;">QTD.</th>
              <th style="width: 10%; text-align: right;">VR. UNIT.</th>
              <th style="width: 15%; text-align: right;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item: any, index: number) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>
                  <strong>${item.produtos?.nome || 'Produto Indefinido'}</strong>
                  <div class="product-desc">
                    Produto comercializado no âmbito da economia circular.<br/>
                    Item novo, testado e em pleno funcionamento, podendo apresentar pequenas avarias estéticas (riscos ou amassados leves), que não comprometem seu desempenho.<br/><br/>
                    Nos termos do Art. 6º, III e Art. 26, II da Lei nº 8.078/1990 (Código de Defesa do Consumidor), o produto possui garantia legal de 90 (noventa) dias, para vícios aparentes ou de fácil constatação.<br/><br/>
                    Cliente ciente no ato da compra.
                  </div>
                </td>
                <td class="text-center">und</td>
                <td class="text-center">${Number(item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">${Number(item.preco_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">${Number(item.subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-right font-bold">TOTAL</th>
              <th class="text-center font-bold">${items.reduce((acc: number, item: any) => acc + item.quantidade, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</th>
              <th></th>
              <th class="text-right font-bold">${Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</th>
            </tr>
          </tfoot>
        </table>
        
        <div style="background-color: #f0f0f0; padding: 10px; border: 1px solid #000; text-align: right; font-weight: bold; margin-bottom: 15px; font-size: 13px;">
          PRODUTOS: ${Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br/>
          TOTAL: R$ ${Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
        
        <div class="section-title">DADOS DO PAGAMENTO</div>
        <table>
          <thead>
            <tr>
              <th>VENCIMENTO</th>
              <th>VALOR DA PARCELA</th>
              <th>FORMA DE PAGAMENTO</th>
              <th>OBSERVAÇÃO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${dataVenda}</td>
              <td>${Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td>${venda.forma_pagamento || ''}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        
        <div class="termo">
          <h3>TERMO DE CIÊNCIA E CONCORDÂNCIA<br/>PRODUTOS ELETRO DVOLTA – ECONOMIA CIRCULAR</h3>
          <p><strong>declaro que:</strong></p>
          <p>1. Estou adquirindo um produto oriundo da economia circular.</p>
          <p>2. Fui informado(a) de forma clara e adequada que o produto:</p>
          <ul>
            <li>É novo;</li>
            <li>Nunca foi utilizado por consumidor final;</li>
            <li>Está em pleno funcionamento;</li>
            <li>Foi previamente testado;</li>
          </ul>
          <p>3. Fui informado(a) de que o produto pode apresentar pequenas avarias estéticas, tais como:</p>
          <ul>
            <li>Riscos superficiais;</li>
            <li>Pequenos amassados;</li>
            <li>Imperfeições externas;</li>
          </ul>
          <p>4. Estou ciente de que tais avarias são exclusivamente estéticas e não comprometem o funcionamento do equipamento.</p>
          <p>5. Estou ciente de que, conforme o Art. 26, II do Código de Defesa do Consumidor (Lei nº 8.078/1990), por se tratar de bem durável, o produto possui garantia legal de 90 (noventa) dias para vícios aparentes ou de fácil constatação.</p>
          <p>6. Estou ciente de que, em caso de eventual vício funcional, aplica-se o disposto no Art. 18 do Código de Defesa do Consumidor.</p>
          <p style="margin-top: 15px; font-weight: bold;">Declaro que recebi todas as informações de forma clara e que concordo com as condições apresentadas.</p>
        </div>

        <div class="signature">
          <div class="signature-line">
            Assinatura do cliente
          </div>
        </div>
        
        <script>
          setTimeout(() => { window.print(); setTimeout(() => window.close(), 500); }, 500);
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
