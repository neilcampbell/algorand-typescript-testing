import { Account, arc4, assert, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

function get_1st_ref_index(): uint64 {
  return op.btoi(Txn.applicationArgs(1))
}

export class StateAcctParamsGetContract extends arc4.Contract {
  @arc4.abimethod()
  public verify_acct_balance(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctBalance(a)
    const [value_index, funded_index] = op.AcctParams.acctBalance(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    assert(value === a.balance, 'expected Account balance to match')
    assert(value === op.balance(a), 'expected op.balance to match')
    assert(value === op.balance(get_1st_ref_index()), 'expected op.balance by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_min_balance(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctMinBalance(a)
    const [value_index, funded_index] = op.AcctParams.acctMinBalance(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    assert(value === a.minBalance, 'expected Account min_balance to match')
    assert(value === op.minBalance(a), 'expected op.min_balance to match')
    assert(value === op.minBalance(get_1st_ref_index()), 'expected op.min_balance by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_auth_addr(a: Account): Address {
    const [value, funded] = op.AcctParams.acctAuthAddr(a)
    const [value_index, funded_index] = op.AcctParams.acctAuthAddr(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return new Address(value)
  }

  @arc4.abimethod()
  public verify_acct_total_num_uint(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalNumUint(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalNumUint(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_num_byte_slice(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalNumByteSlice(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalNumByteSlice(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_extra_app_pages(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalExtraAppPages(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalExtraAppPages(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_apps_created(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAppsCreated(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAppsCreated(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_apps_opted_in(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAppsOptedIn(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAppsOptedIn(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_assets_created(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAssetsCreated(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAssetsCreated(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_assets(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalAssets(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalAssets(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_boxes(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalBoxes(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalBoxes(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_total_box_bytes(a: Account): uint64 {
    const [value, funded] = op.AcctParams.acctTotalBoxBytes(a)
    const [value_index, funded_index] = op.AcctParams.acctTotalBoxBytes(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }

  @arc4.abimethod()
  public verify_acct_incentive_eligible(a: Account): boolean {
    const [value, funded] = op.AcctParams.acctIncentiveEligible(a)
    const [value_index, funded_index] = op.AcctParams.acctIncentiveEligible(get_1st_ref_index())
    assert(value === value_index, 'expected value by index to match')
    assert(funded === funded_index, 'expected funded by index to match')
    return value
  }
}
