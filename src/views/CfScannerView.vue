<template>
    
    <div class="container border rounded-2 mt-2 border-dark">
        <div class="row my-2">
            <label for="max-latency" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">最大延迟：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-2">
                <input class="form-control" type="number" id="max-latency" min="50" max="3000" step="50" value="500">
            </div>
            <label for="protocol" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">协议：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-2">
                <select class="form-control" id="protocol">
                    <option value="http" selected>HTTP</option>
                    <option value="https">HTTPS</option>
                </select>
            </div>
            <label for="port-no" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">端口号：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-2">
                <select class="form-control" id="port-no"></select>
            </div>
        </div>
        <div class="row my-2">
            <label for="max-ip" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">IP数量：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-2">
                <input class="form-control" type="number" id="max-ip" min="1" max="5000" value="5">
            </div>
            <label for="ip-regex" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">正则表达式：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-6">
                <input type="text" class="form-control" dir="ltr" id="ip-regex" placeholder="^104\.17\.|^141\.">
            </div>
        </div>
        <div class="row my-2">
            <label for="ip-include" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">包括的IP范围：</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-4">
                <input type="text" class="form-control" dir="ltr" id="ip-include"
                    placeholder="104.17.166.0/24,172.64.59.0/24">
            </div>
            <label for="ip-exclude" class="col-sm-12 col-md-4 col-lg-2 col-form-label">
                <span class="lang-field lang-cn">排除的IP范围</span>
            </label>
            <div class="col-sm-12 col-md-8 col-lg-4">
                <input type="text" class="form-control" dir="ltr" id="ip-exclude" placeholder="8,103.22">
            </div>
        </div>
        <div class="row my-2">
            <div class="btn-group col-xs-3 col-lg-4 my-1" role="group">
                <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#ip-ranges-modal">
                    <span class="lang-field lang-cn">查看IP范围</span>
                </button>
                <div class="modal fade" id="ip-ranges-modal" tabindex="-1" aria-labelledby="ip-ranges-modal-label"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="ip-ranges-modal-label">
                                    <span class="lang-field lang-cn">IP范围</span>
                                </h5>
                            </div>
                            <div class="modal-body">
                                <table dir="ltr" class="table table-striped text-center">
                                    <tbody id="ip-ranges-body"></tbody>
                                </table>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <span class="lang-field lang-cn">关闭</span>
                                </button>
                                <button type="button" class="btn btn-primary"
                                    onclick="copyToClipboard(cfIPv4.join(`\n`))">
                                    <span class="lang-field lang-cn">复制</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group col-xs-3 col-lg-4"></div>
            <div class="btn-group col-xs-6 col-lg-4 my-1" role="group">
                <button id="btn-start" class="btn btn-success btn-sm rounded-2 fw-bold" disabled type="button"
                    onclick="startScan()">
                    <span class="lang-field lang-cn">开始</span>
                </button>&nbsp;
                <button id="btn-cancel" class="btn btn-outline-secondary btn-sm rounded-2 fw-bold d-none" type="button"
                    onclick="cancelScan()">
                    <span class="lang-field lang-cn">取消</span>
                </button>
                <button id="btn-reset" class="btn btn-outline-danger btn-sm rounded-2 fw-bold" type="button"
                    onclick="resetDefaults()">
                    <span class="lang-field lang-cn">重置默认值</span>
                </button>
            </div>
        </div>
        <div class="row my-2 border-bottom border-dark py-3">
            <div id="start-hint" class="col-xs-12 col-lg-5 text-danger fw-bold py-1">
                <span class="lang-field lang-cn">在开始之前请先关闭你的VPN！</span>
            </div>
            <div class="col col-xs-2 col-lg-1 py-1" id="test-no"></div>
            <div class="col col-xs-6 col-lg-3 py-1" id="ip-no"></div>
            <div class="col col-xs-1 col-lg-1 py-1" id="ip-try"></div>
            <div class="col col-xs-3 col-lg-2 py-1" id="ip-latency"></div>
        </div>
        <table class="table table-striped" dir="ltr">
            <thead>
                <tr>
                    <th width="35">
                        #
                    </th>
                    <th style="min-width: 150px;">
                        <span class="lang-field lang-cn">IP</span>
                    </th>
                    <th>
                        <span class="lang-field lang-cn">延迟</span>
                    </th>
                    <th width="70">
                        <div class="btn-group" role="group" dir="ltr">
                            <button class="btn btn-outline-secondary btn-sm" onclick="downloadAsCSV()"><img
                                    height="20px" src="/assets/icon-csv.png" /></button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="downloadAsJSON()"><img
                                    height="20px" src="/assets/icon-json.png" /></button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="copyAllToClipboard()"><img
                                    height="20px" src="/assets/icon-copy.png" /></button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="result">
            </tbody>
        </table>
    </div>
</template>